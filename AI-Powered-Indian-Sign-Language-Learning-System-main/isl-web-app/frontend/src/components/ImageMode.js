import React, { useState, useEffect, useRef } from 'react';

const ImageMode = () => {
    const [word, setWord] = useState("");
    const [viewMode, setViewMode] = useState("image");
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const videoRef = useRef(null);

    const letters = word.toUpperCase().split("").filter(char => /[A-Z0-9]/.test(char));

    // Jab Index change ho, tab video load aur play ho
    useEffect(() => {
        if (viewMode === 'video' && isPlaying && videoRef.current) {
            videoRef.current.load();
            videoRef.current.play().catch(err => console.log("Playback error:", err));
        }
    }, [currentIndex, isPlaying, viewMode]);

    // --- Smooth Transition Logic ---
    const handleVideoEnded = () => {
        if (isPlaying) {
            if (currentIndex < letters.length - 1) {
                // Agar abhi letters baaki hain, toh next par jao
                setCurrentIndex(prev => prev + 1);
            } else {
                // Agar word khatam ho gaya, toh loop ya stop
                setIsPlaying(false);
                setCurrentIndex(0);
            }
        }
    };

    const togglePlay = () => {
        if (letters.length > 0) {
            if (!isPlaying) {
                setCurrentIndex(0);
                setIsPlaying(true);
            } else {
                setIsPlaying(false);
            }
        }
    };

    return (
        <div className="learning-container">
            <div className="learning-header-centered">
                <h1 className="gradient-text">AI Sign Language Translator</h1>

                <div className="translator-controls-wrapper">
                    <div className="mode-toggle-group">
                        <button
                            className={`mode-btn ${viewMode === 'image' ? 'active' : ''}`}
                            onClick={() => { setViewMode('image'); setIsPlaying(false); }}
                        >
                            🖼️ Image Sequence
                        </button>
                        <button
                            className={`mode-btn ${viewMode === 'video' ? 'active' : ''}`}
                            onClick={() => { setViewMode('video'); setIsPlaying(false); }}
                        >
                            🎥 Animated Avatar
                        </button>
                    </div>

                    <div className="search-box-centered">
                        <input
                            type="text"
                            placeholder="Type a word or sentence..."
                            value={word}
                            onChange={(e) => {
                                setWord(e.target.value);
                                setIsPlaying(false);
                                setCurrentIndex(0);
                            }}
                            className="search-input-premium fix-visibility"
                            autoFocus
                        />
                    </div>
                </div>
            </div>

            <div className="display-surface-main">
                {letters.length > 0 ? (
                    <div className="main-content-layout">
                        {/* --- Video Player with Event Listener --- */}
                        {viewMode === 'video' && (
                            <div className="video-player-merged">
                                <div className="video-header-mini">
                                    <span>ACTION: <b>{letters[currentIndex]}</b></span>
                                    <span className="status-dot-active"></span>
                                </div>
                                <div className="video-main-frame">
                                    <video
                                        ref={videoRef}
                                        onEnded={handleVideoEnded} // YAHAN MAGIC HAI: Video khatam hone par hi next hoga
                                        muted
                                        className="merged-video-element"
                                    >
                                        <source src={`http://127.0.0.1:5000/static/isl_videos/${letters[currentIndex]}.mp4`} type="video/mp4" />
                                    </video>
                                    {!isPlaying && (
                                        <div className="video-overlay-play" onClick={togglePlay}>▶</div>
                                    )}
                                </div>
                                <div className="video-footer-controls">
                                    <button onClick={togglePlay} className="btn-action">
                                        {isPlaying ? "⏸️ Pause" : "▶️ Play Word"}
                                    </button>
                                    <div className="progress-info">
                                        Step {currentIndex + 1} of {letters.length}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="fluid-grid-container">
                            <div className="sign-gallery-grid">
                                {letters.map((char, index) => (
                                    <div
                                        key={index}
                                        className={`sign-card-premium ${index === currentIndex && isPlaying ? 'active-highlight' : ''}`}
                                    >
                                        <div className="card-letter-top">{char}</div>
                                        <div className="card-img-holder">
                                            <img
                                                src={`http://127.0.0.1:5000/static/asl_images/${char}/${char}.jpg`}
                                                alt={char}
                                                onError={(e) => { e.target.src = `https://placehold.jp/1e293b/38bdf8/150x150.png?text=${char}`; }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="empty-state-placeholder">
                        <p>Type to generate full-action ISL signs...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageMode;