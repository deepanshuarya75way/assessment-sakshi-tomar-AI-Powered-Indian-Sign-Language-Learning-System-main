import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import SmartMode from './SmartMode';
const VideoPlayer = ({ predictedWord }) => {
    // --- Core States ---
    const [mode, setMode] = useState("camera");
    const [inputData, setInputData] = useState("");
    const [viewType, setViewType] = useState("video");
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // --- Specialized Camera States ---
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isPredicting, setIsPredicting] = useState(false);
    const [confidence, setConfidence] = useState(0);

    // ✅ Privacy Shield State
    const [isPrivacyOn, setIsPrivacyOn] = useState(false);

    // --- ✅ Neural Autocomplete States ---
    const [suggestions, setSuggestions] = useState([]);
    const ISL_DICTIONARY = [
    "APPLE", "ALWAYS", "ANGRY", "ALIVE", "AFTER",
    "BREAD", "BOOK", "BEFORE", "BAD", "BUSY",
    "COMPUTER", "COFFEE", "COLD", "CLEAN", "COME",
    "DRINK", "DANGER", "DAILY", "DONE", "DOOR",
    "EAT", "EVERY", "EMPTY", "EARLY", "ENJOY",
    "FRIEND", "FOOD", "FAST", "FEEL", "FAMILY",
    "GOOD", "GIVE", "GO", "GREAT", "GARDEN",
    "HELLO", "HELP", "HAPPY", "HOME", "HOUSE",
    "INDIA", "IMPORTANT", "INSIDE", "ICE", "IDEA",
    "JOB", "JOY", "JUST", "JOIN", "JUMP",
    "KIND", "KNOW", "KEEP", "KITCHEN", "KEY",
    "LOVE", "LEARN", "LITTLE", "LUNCH", "LOOK",
    "MOTHER", "MONEY", "MORE", "MORNING", "MUSIC",
    "NAME", "NEXT", "NIGHT", "NOW", "NEVER",
    "OPEN", "OFFICE", "ONLY", "OUTSIDE", "ORDER",
    "PLEASE", "PHONE", "PLAY", "PAPER", "PEOPLE",
    "QUICK", "QUIET", "QUESTION", "QUALITY", "QUEEN",
    "READ", "READY", "REST", "RIGHT", "ROOM",
    "SIGN", "SCHOOL", "SLEEP", "SLOW", "SORRY",
    "THANKYOU", "TIME", "TODAY", "TEA", "TRAVEL",
    "UNDER", "UP", "USE", "UNTIL", "UNDERSTAND",
    "VERY", "VIDEO", "VISIT", "VOICE", "VACATION",
    "WATER", "WORK", "WASH", "WRITE", "WAIT",
    "XRAY", "XYLOPHONE", "XEROX",
    "YES", "YESTERDAY", "YOU", "YOUNG", "YELLOW",
    "ZERO", "ZEBRA", "ZONE", "ZOOM"
  ];
    const videoRef = useRef(null);
    const cameraRef = useRef(null);
    const streamRef = useRef(null);
    const socketRef = useRef(null);
    const canvasRef = useRef(document.createElement('canvas'));

    // Derived letters sequence
    const letters = inputData.toUpperCase().split("").filter(char => /[A-Z0-9]/.test(char));

    // --- 📡 Socket Connection Setup ---
    useEffect(() => {
        socketRef.current = io("http://127.0.0.1:5000");

        socketRef.current.on('prediction_result', (data) => {
            if (data.confidence > 0.65) {
                setInputData(data.label);
                setConfidence(Math.round(data.confidence * 100));
            }
        });

        return () => socketRef.current.disconnect();
    }, []);

    // --- ✅ Neural Autocomplete Logic ---
    useEffect(() => {
        if (inputData.length > 0 && mode === "camera") {
            const matches = ISL_DICTIONARY.filter(word =>
                word.startsWith(inputData.toUpperCase()) && word !== inputData.toUpperCase()
            ).slice(0, 3);
            setSuggestions(matches);
        } else {
            setSuggestions([]);
        }
    }, [inputData, mode]);

    // --- 📷 Real-Time Frame Capturing (🔥 ADAPTIVE THROTTLING INTEGRATED) ---
    useEffect(() => {
        let interval;
        if (isCameraOn && isPredicting) {
            // ✅ Dynamic Speed Logic:
            // 1. High Confidence (>90%) -> Power Save Mode (650ms)
            // 2. Low Confidence/New Sign -> High Performance Mode (350ms)
            const adaptiveSpeed = confidence > 90 ? 650 : 350;

            interval = setInterval(() => {
                const video = cameraRef.current;
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');

                if (video && video.readyState === 4) {
                    canvas.width = 64;
                    canvas.height = 64;
                    context.drawImage(video, 0, 0, 64, 64);
                    const base64Image = canvas.toDataURL('image/jpeg', 0.8);
                    socketRef.current.emit('process_frame', { image: base64Image });
                }
            }, adaptiveSpeed);
        }
        return () => clearInterval(interval);
    }, [isCameraOn, isPredicting, confidence]); // 🔥 Confidence change hote hi engine speed badlega

    // --- Prediction Logic from Props ---
    useEffect(() => {
        if (predictedWord && mode === "camera" && isCameraOn && isPredicting) {
            setInputData(predictedWord);
        }
    }, [predictedWord, mode, isCameraOn, isPredicting]);

    // --- Smooth Video Transition ---
    const handleVideoEnded = () => {
        if (isPlaying && currentIndex < letters.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsPlaying(false);
            setCurrentIndex(0);
        }
    };

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.play().catch(err => console.log("Playback error:", err));
            else videoRef.current.pause();
        }
    }, [isPlaying, currentIndex]);

    // --- Camera Control ---
    const toggleCamera = async () => {
        if (isCameraOn) {
            if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
            if (cameraRef.current) cameraRef.current.srcObject = null;
            setIsCameraOn(false); setIsPredicting(false); setIsPrivacyOn(false); setInputData("");
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                streamRef.current = stream;
                if (cameraRef.current) cameraRef.current.srcObject = stream;
                setIsCameraOn(true);
            } catch (err) { alert("Camera access denied!"); }
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => { setInputData(e.target.result); setCurrentIndex(0); setIsPlaying(false); };
            reader.readAsText(file);
        }
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return alert("Browser not supported");
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.onresult = (event) => { setInputData(event.results[0][0].transcript); setCurrentIndex(0); };
        recognition.start();
    };

    return (
        <div className="hub-master-container">
            <div className="hub-content-box">
                <header className="hub-header">
                    <h1 className="neon-title">Real-Time ISL Hub</h1>
                    <div className="hub-glass-tabs">
                        {['camera', 'text', 'file', 'audio'].map((m) => (
                            <button key={m} onClick={() => { setMode(m); setIsPlaying(false); setInputData(""); setCurrentIndex(0); }} className={`tab-btn ${mode === m ? 'active' : ''}`}>
                                {m.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </header>

                <main className="hub-input-area">
                    {mode === "camera" && (
                        <div className="camera-section">
                            <div className={`camera-window ${isPredicting ? 'scanning' : ''} ${isPrivacyOn ? 'privacy-skeleton' : ''}`}>
                                {isCameraOn && (
                                    <div className="live-badge">
                                        {isPredicting ? `SCANNING ● ${confidence}%` : "STANDBY ●"}
                                        {/* ✅ UI Indicator for Adaptive Throttling */}
                                        {isPredicting && (
                                            <span className="throttle-tag">
                                                | {confidence > 90 ? '🔋 ECO-MODE' : '⚡ HIGH-PERF'}
                                            </span>
                                        )}
                                        {isPrivacyOn && <span className="privacy-tag"> | SKELETON</span>}
                                    </div>
                                )}
                                <video ref={cameraRef} autoPlay playsInline muted className="camera-feed" />
                                {!isCameraOn && <div className="cam-off-msg">AI CAMERA DISCONNECTED</div>}
                                {isPredicting && <div className="scan-line-effect"></div>}
                            </div>

                            <div className="camera-control-hub">
                                <button onClick={toggleCamera} className={`action-pill ${isCameraOn ? 'off' : 'on'}`}>
                                    {isCameraOn ? "🔴 STOP CAMERA" : "🔵 START CAMERA"}
                                </button>

                                {isCameraOn && (
                                    <div className="dual-actions">
                                        <button onClick={() => setIsPredicting(!isPredicting)} className={`action-pill ${isPredicting ? 'predict-off' : 'predict-on'}`}>
                                            {isPredicting ? "⏸ PAUSE AI" : "⚡ START PREDICTION"}
                                        </button>
                                        <button onClick={() => setIsPrivacyOn(!isPrivacyOn)} className={`action-pill privacy-btn ${isPrivacyOn ? 'active' : ''}`}>
                                            {isPrivacyOn ? "🛡️ FULL VIEW" : "👤 PRIVACY"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="prediction-display-modern">
                                <span className="label">DETECTION:</span>
                                <strong className="result-val">{inputData || "---"}</strong>

                                {suggestions.length > 0 && (
                                    <div className="suggestion-wrapper">
                                        {suggestions.map((word) => (
                                            <button key={word} onClick={() => setInputData(word)} className="suggestion-chip">
                                                {word} ⇥
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                        {isPredicting && (
    <SmartMode inputData={inputData} />
)}
                        </div>

                    )}
                </main>

                <section className="hub-output-section">
                    <div className="output-toggle">
                        <button onClick={() => setViewType("image")} className={viewType === "image" ? "active" : ""}>IMAGES</button>
                        <button onClick={() => setViewType("video")} className={viewType === "video" ? "active" : ""}>ANIMATION</button>
                    </div>

                    <div className="output-screen-frame">
                        {letters.length > 0 ? (
                            viewType === "video" ? (
                                <div className="video-player-frame">
                                    <div className="video-info-bar">
                                        <span>Action: <b>{letters[currentIndex]}</b></span>
                                        <span className="sequence-count">{currentIndex + 1} / {letters.length}</span>
                                    </div>

                                    <div className="video-visual-container" onClick={() => setIsPlaying(!isPlaying)}>
                                        <video
                                            key={letters[currentIndex]}
                                            ref={videoRef}
                                            onEnded={handleVideoEnded}
                                            autoPlay={isPlaying}
                                            muted
                                            className="player-video-main"
                                        >
                                            <source src={`http://127.0.0.1:5000/static/isl_videos/${letters[currentIndex]}.mp4`} type="video/mp4" />
                                        </video>
                                        {!isPlaying && <div className="center-play-hint">▶</div>}
                                    </div>

                                    <div className="video-action-bar">
                                        <button className="play-pause-btn" onClick={() => setIsPlaying(!isPlaying)}>
                                            {isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
                                        </button>
                                        <button className="replay-btn" onClick={() => {setCurrentIndex(0); setIsPlaying(true);}}>
                                            🔄 REPLAY
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="image-gallery-scroll">
                                    {letters.map((char, i) => (
                                        <div key={i} className={`sign-thumbnail ${currentIndex === i && isPlaying ? 'highlight' : ''}`}>
                                            <span className="thumb-char">{char}</span>
                                            <img src={`http://127.0.0.1:5000/static/asl_images/${char}/${char}.jpg`} alt={char} onError={(e) => e.target.src=`https://placehold.jp/18/1e293b/38bdf8/80x80.png?text=${char}`} />
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="empty-guide">Translate result will appear here...</div>
                        )}
                    </div>
                </section>
            </div>
            <style>{`
                .scan-line-effect { position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: #38bdf8; box-shadow: 0 0 15px #38bdf8; animation: scanAnim 2s infinite linear; z-index: 5; }
                @keyframes scanAnim { 0% { top: 0; } 100% { top: 100%; } }
                .suggestion-wrapper { display: flex; gap: 10px; margin-top: 15px; justify-content: center; flex-wrap: wrap; }
                .suggestion-chip { background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; cursor: pointer; transition: 0.3s; text-transform: uppercase; }
                .suggestion-chip:hover { background: rgba(56, 189, 248, 0.2); border-color: #38bdf8; }

                /* Privacy Skeleton Styles */
                .privacy-skeleton .camera-feed { filter: brightness(0.4) contrast(2) grayscale(1) blur(2px); }
                .privacy-tag { color: #fb7185; font-weight: 900; }
                .dual-actions { display: flex; gap: 10px; }
                .privacy-btn.active { background: #fb7185; color: white; border-color: #fb7185; }
                .privacy-btn { border: 1px solid #64748b; color: #94a3b8; }
            `}</style>
        </div>

    );
};

export default VideoPlayer