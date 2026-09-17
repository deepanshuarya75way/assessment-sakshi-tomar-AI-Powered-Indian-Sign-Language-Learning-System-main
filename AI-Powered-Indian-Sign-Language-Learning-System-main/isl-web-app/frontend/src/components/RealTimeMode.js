import React, { useState, useEffect } from 'react';
import Recognition from './Recognition';

const RealTimeMode = () => {
    const [prediction, setPrediction] = useState("OFFLINE");
    const [confidence, setConfidence] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isPredictionEnabled, setIsPredictionEnabled] = useState(false);
    const [history, setHistory] = useState([]);

    // --- 🚀 Prediction UI Update Logic ---
    const updateResultUI = (label, prob) => {
        setPrediction(label);
        setConfidence(Math.round(prob * 100));

        setHistory(prevHistory => {
            if (prevHistory[0] !== label) {
                const newHistory = [label, ...prevHistory].slice(0, 15);

                if (!isMuted) {
                    window.speechSynthesis.cancel();
                    const utterance = new SpeechSynthesisUtterance(label);
                    utterance.rate = 1.1;
                    window.speechSynthesis.speak(utterance);
                }
                return newHistory;
            }
            return prevHistory;
        });
    };

    // Callback for live camera frames
    const handlePrediction = (label, prob) => {
        if (!isPredictionEnabled) return;

        const cleanLabel = String(label || "-");
        const cleanProb = (Number(prob) || 0);

        if (cleanProb < 0.65 || cleanLabel === "Analyzing..." || cleanLabel === "Offline") {
            return;
        }

        updateResultUI(cleanLabel, cleanProb);
    };

    // --- 📁 NEW: Image Upload Logic ---
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setPrediction("UPLOADING...");

        try {
            // Backend route jo humne abhi banaya tha
            const response = await fetch('http://127.0.0.1:5000/api/upload_predict', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (data.prediction) {
                updateResultUI(data.prediction, data.confidence / 100);
            } else {
                setPrediction("ERR: No Result");
            }
        } catch (err) {
            console.error("Upload failed:", err);
            setPrediction("REFUSED");
        }
    };

    useEffect(() => {
        if (!isPredictionEnabled) {
            setPrediction("OFFLINE");
            setConfidence(0);
        } else {
            setPrediction("READY");
        }
    }, [isPredictionEnabled]);

    return (
        <div style={s.master}>
            <style>
                {`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                `}
            </style>

            <div style={s.container}>
                <header style={s.header}>
                    <div style={s.badge}>NEURAL ENGINE v3.1</div>
                    <h1 style={s.title}>Neural <span style={s.cyan}>Interpreter</span></h1>
                    <p style={s.desc}>Hybrid Sign Detection (Live Camera + Photo Upload).</p>
                </header>

                <div style={s.mainGrid}>
                    <div style={s.camBox}>
                        <div style={s.camHeader}>
                            <div style={{
                                ...s.liveDot,
                                background: isPredictionEnabled ? '#ef4444' : '#475569',
                                boxShadow: isPredictionEnabled ? '0 0 12px #ef4444' : 'none'
                            }}></div>
                            <span style={{fontSize: '0.8rem', fontWeight:'bold', letterSpacing: '1px'}}>
                                {isPredictionEnabled ? "ENGINE ACTIVE" : "ENGINE STANDBY"}
                            </span>
                        </div>
                        <div style={s.recognitionWrap}>
                            <Recognition onPredict={handlePrediction} isEnabled={isPredictionEnabled} />
                            {isPredictionEnabled && <div style={s.scanLine}></div>}
                        </div>

                        {/* --- Buttons Footer --- */}
                        <div style={s.camFooter}>
                            <button
                                onClick={() => setIsPredictionEnabled(!isPredictionEnabled)}
                                style={{
                                    ...s.ctrlBtn,
                                    background: isPredictionEnabled ? 'rgba(239, 68, 68, 0.1)' : 'rgba(56, 189, 248, 0.1)',
                                    borderColor: isPredictionEnabled ? '#ef4444' : '#38bdf8',
                                    color: isPredictionEnabled ? '#ef4444' : '#38bdf8'
                                }}
                            >
                                {isPredictionEnabled ? "🛑 Stop Camera" : "🚀 Start Camera"}
                            </button>

                            {/* 📁 UPLOAD OPTION ADDED HERE */}
                            <label style={{...s.ctrlBtn, background: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981', color: '#10b981', cursor: 'pointer'}}>
                                📁 Test Photo
                                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                            </label>

                            <button onClick={() => setIsMuted(!isMuted)} style={s.ctrlBtn}>
                                {isMuted ? "🔈 Unmute" : "🔇 Mute"}
                            </button>
                            <button onClick={() => setHistory([])} style={s.ctrlBtn}>🧹 Clear</button>
                        </div>
                    </div>

                    <div style={s.outputBox}>
                        <div style={s.resultCard}>
                            <p style={s.label}>NEURAL OUTPUT</p>
                            <h2 style={{
                                ...s.bigResult,
                                opacity: prediction === "OFFLINE" ? 0.2 : 1,
                                color: confidence > 85 ? '#fff' : '#94a3b8'
                            }}>
                                {prediction}
                            </h2>

                            <div style={s.meterBg}>
                                <div style={{
                                    width: `${confidence}%`,
                                    height: '100%',
                                    background: confidence > 85 ? 'linear-gradient(90deg, #38bdf8, #10b981)' : '#38bdf8',
                                    transition: '0.8s ease-out',
                                    borderRadius: '10px'
                                }}></div>
                            </div>
                            <div style={{display:'flex', justifyContent:'space-between', marginTop:'15px'}}>
                                <p style={s.confText}>Accuracy Rate</p>
                                <p style={{...s.confText, color: '#38bdf8', fontWeight:'bold'}}>{confidence}%</p>
                            </div>
                        </div>

                        <div style={s.historyCard}>
                            <p style={s.label}>SESSION LOGS</p>
                            <div style={s.historyList}>
                                {history.length > 0 ? history.map((h, i) => (
                                    <div key={i} style={s.historyItem}>{h}</div>
                                )) : (
                                    <p style={{color: '#475569', fontSize: '0.85rem'}}>No data detected yet...</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const s = {
    master: { paddingTop: '100px', background: '#020617', minHeight: '100vh', color: '#f8fafc', fontFamily: "'Inter', sans-serif" },
    container: { width: '95%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '50px' },
    header: { textAlign: 'center', marginBottom: '50px' },
    badge: { background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '6px 16px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold', display: 'inline-block', marginBottom: '10px' },
    title: { fontSize: '3.5rem', fontWeight: '900', margin: '0', color: '#fff' },
    cyan: { color: '#38bdf8' },
    desc: { color: '#64748b', fontSize: '1.1rem', marginTop: '10px' },
    mainGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '35px' },
    camBox: { background: '#0f172a', borderRadius: '30px', border: '1px solid #1e293b', overflow: 'hidden' },
    camHeader: { padding: '15px 25px', background: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px' },
    liveDot: { width: '10px', height: '10px', borderRadius: '50%' },
    recognitionWrap: { position: 'relative', width: '100%', background: '#000', display: 'flex', justifyContent: 'center', minHeight: '450px' },
    scanLine: { position: 'absolute', width: '100%', height: '2px', background: '#38bdf8', boxShadow: '0 0 15px #38bdf8', animation: 'scan 3s infinite linear', zIndex: 10 },
    camFooter: { padding: '25px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' },
    ctrlBtn: { background: 'rgba(255,255,255,0.03)', border: '1px solid #1e293b', color: '#fff', padding: '12px 18px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold', transition: '0.3s' },
    outputBox: { display: 'flex', flexDirection: 'column', gap: '25px' },
    resultCard: { background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)', padding: '50px 40px', borderRadius: '30px', border: '1px solid rgba(56, 189, 248, 0.1)', textAlign: 'center' },
    label: { fontSize: '0.7rem', color: '#38bdf8', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '25px' },
    bigResult: { fontSize: '8rem', margin: '0', color: '#fff', fontWeight: '900', lineHeight: '1' },
    meterBg: { width: '100%', height: '8px', background: '#020617', borderRadius: '10px', overflow: 'hidden', marginTop: '30px' },
    confText: { fontSize: '0.85rem', color: '#64748b' },
    historyCard: { background: '#0f172a', padding: '30px', borderRadius: '30px', border: '1px solid #1e293b' },
    historyList: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' },
    historyItem: { background: '#1e293b', padding: '10px 18px', borderRadius: '12px', color: '#38bdf8', fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid rgba(56,189,248,0.1)' }
};

export default RealTimeMode;