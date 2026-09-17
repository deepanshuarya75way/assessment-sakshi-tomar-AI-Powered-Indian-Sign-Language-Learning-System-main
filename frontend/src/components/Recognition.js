import React, { useRef, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = "http://127.0.0.1:5000";

// --- 🛠️ CONFIG: Box ka Size aur Position ---
// Box hamesha square rahega (1:1 aspect ratio model ke liye best hai)
const BOX_SIZE = 320; // Box ki width/height pixels mein

const Recognition = ({ onPredict, isEnabled }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const overlayCanvasRef = useRef(null); // Box draw karne ke liye naya canvas
    const socketRef = useRef(null);
    const frameIntervalRef = useRef(null);

    const [localPrediction, setLocalPrediction] = useState("");
    const [localConfidence, setLocalConfidence] = useState(0);
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    // Box ko center mein align karne ke liye coordinates compute karna
    const getBoxCoords = useCallback((video) => {
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        const x = (vw - BOX_SIZE) / 2;
        const y = (vh - BOX_SIZE) / 2;
        return { x, y, w: BOX_SIZE, h: BOX_SIZE };
    }, []);

    // 1. Frame Capture Logic (Sirf Box ke andar ka area)
    const captureFrame = useCallback(() => {
        if (!isEnabled || !videoRef.current || !socketRef.current?.connected) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Box ke coordinates nikalna
        const box = getBoxCoords(video);

        // Canvas ko model ke input size par set karna (e.g., 64x64 or 224x224)
        canvas.width = 512; // Higher resolution for better preprocessing in backend
        canvas.height = 128;

        // --- 🛠️ CROPPING LOGIC: Sirf Box ka hissa draw karna ---
        context.drawImage(
            video,
            box.x, box.y, box.w, box.h, // Source (Video mein se Box ka area lelo)
            0, 0, canvas.width, canvas.height // Destination (Canvas par fit kar do)
        );

        const base64Image = canvas.toDataURL('image/jpeg', 0.9);
        socketRef.current.emit('process_frame', { image: base64Image });
    }, [isEnabled, getBoxCoords]);

    // Video stream load hone par overlay canvas setup karna
    const setupOverlay = useCallback(() => {
        const video = videoRef.current;
        const overlay = overlayCanvasRef.current;
        if (!video || !overlay) return;

        overlay.width = video.clientWidth;
        overlay.height = video.clientHeight;
        const ctx = overlay.getContext('2d');

        // Box coordinates (responsive layout ke liye css width use kar rahe hain)
        const scale = video.clientWidth / video.videoWidth;
        const boxW = BOX_SIZE * scale;
        const boxX = (video.clientWidth - boxW) / 2;
        const boxY = (video.clientHeight - boxW) / 2;

        // Draw Box UI
        ctx.clearRect(0, 0, overlay.width, overlay.height);
        ctx.strokeStyle = '#38bdf8'; // Cyan color
        ctx.lineWidth = 4;
        ctx.setLineDash([15, 10]); // Dashed line effect
        ctx.strokeRect(boxX, boxY, boxW, boxW);

        // Add text label
        ctx.font = 'bold 14px sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('ALIGN PALM HERE', boxX + 10, boxY + boxW - 15);

    }, []);

    useEffect(() => {
        socketRef.current = io(SOCKET_URL, { transports: ['polling'], forceNew: true });
        socketRef.current.on('connect', () => setIsSocketConnected(true));
        socketRef.current.on('prediction_result', (data) => {
            setLocalPrediction(data.label);
            setLocalConfidence(Math.round(data.confidence * 100));
            if (onPredict) onPredict(data.label, data.confidence);
        });

        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 1280, height: 720, frameRate: { ideal: 30 } }
                });
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch (err) { console.error("Camera Error:", err); }
        };

        startCamera();
        frameIntervalRef.current = setInterval(captureFrame, 2000); // 2 sec cycle

        // Responsive box resize handler
        window.addEventListener('resize', setupOverlay);

        return () => {
            clearInterval(frameIntervalRef.current);
            socketRef.current.disconnect();
            window.removeEventListener('resize', setupOverlay);
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, [captureFrame, onPredict, setupOverlay]);

    return (
        <div className="ai-camera-wrapper" style={s.wrapper}>
            <div className="camera-header" style={s.camHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{...s.dot, backgroundColor: isSocketConnected ? '#10b981' : '#ef4444'}}></div>
                    <span>{isSocketConnected ? "ENGINE ACTIVE" : "LINKING..."}</span>
                </div>
                <span style={{ opacity: 0.5 }}>PALM_SYNC V4 • 320px Box</span>
            </div>

            {/* Video Container Aspect 1:1 for better box UI */}
            <div className="video-container" style={s.videoContainer}>
                <video ref={videoRef} autoPlay muted playsInline style={s.videoFeed} onLoadedMetadata={setupOverlay}/>

                {/* 🛠️ OVERLAY CANVAS: Box UI draw karne ke liye */}
                <canvas ref={overlayCanvasRef} style={s.overlayCanvas}/>

                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {isEnabled && <div className="scan-line" style={s.scanBar}></div>}
            </div>

            <div className="prediction-footer" style={s.footer}>
                <div style={s.pRow}>
                    <h2 style={s.pVal}>{isEnabled ? localPrediction || "SCANNING..." : "PAUSED"}</h2>
                    <div style={s.confChip}>{isEnabled ? localConfidence : 0}%</div>
                </div>
                <div style={s.meter}><div style={{...s.fill, width: `${localConfidence}%`}}></div></div>
            </div>

            <style>{`
                @keyframes scanMove { 0% { top: 0%; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
            `}</style>
        </div>
    );
};

const s = {
    wrapper: { width: '100%', background: '#0f172a', borderRadius: '28px', overflow: 'hidden', border: '1px solid #1e293b' },
    camHeader: { padding: '12px 24px', background: '#1e293b', display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: 'bold', color: '#94a3b8' },
    dot: { width: '8px', height: '8px', borderRadius: '50%' },
    // Container aspect should match box UI logic (square is best for alignment)
    videoContainer: { position: 'relative', width: '100%', aspectRatio: '1', background: '#000', overflow: 'hidden' },
    videoFeed: { width: '100%', height: '100%', objectFit: 'cover' },
    overlayCanvas: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3 },
    scanBar: { position: 'absolute', width: '100%', height: '2px', background: '#38bdf8', boxShadow: '0 0 15px #38bdf8', animation: 'scanMove 3s infinite linear', zIndex: 4 },
    footer: { padding: '24px', background: '#0f172a' },
    pRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    pVal: { fontSize: '2.5rem', fontWeight: '900', color: '#fff', margin: 0, textTransform: 'uppercase' },
    confChip: { background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '6px 14px', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold' },
    meter: { width: '100%', height: '8px', background: '#020617', borderRadius: '10px', overflow: 'hidden' },
    fill: { height: '100%', background: 'linear-gradient(90deg, #38bdf8, #10b981)', transition: '0.5s ease-out' }
};

export default Recognition;