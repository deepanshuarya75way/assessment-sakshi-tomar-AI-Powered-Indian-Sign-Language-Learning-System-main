import React, { useState, useEffect, useCallback, useRef } from 'react';
import Recognition from './Recognition';

const Phase2Test = () => {
    const [testStarted, setTestStarted] = useState(false);
    const [testType, setTestType] = useState("mcq");
    const [testMode, setTestMode] = useState("char");
    const [assetType, setAssetType] = useState("video");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(600);
    const [testFinished, setTestFinished] = useState(false);

    // --- Vision/Capture States ---
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [status, setStatus] = useState("waiting"); // waiting, capturing, success, fail
    const [captureTimer, setCaptureTimer] = useState(null);
    const lastPrediction = useRef({ label: "", conf: 0 });

    const randomWords = ["HELLO", "SIGN", "APPLE", "INDIA", "WATER", "BREAD", "HAPPY", "HOME", "WORK", "NAME"];
    const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const finishTest = useCallback((finalScore) => {
        const history = JSON.parse(localStorage.getItem('isl_test_history')) || [];
        history.push({
            type: "Phase 2",
            mode: testType === 'mcq' ? `MCQ` : "Vision AI",
            score: finalScore,
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem('isl_test_history', JSON.stringify(history));
        setTestFinished(true);
    }, [testType]);

    const startTest = (type, mode, asset = "video") => {
        setTestType(type);
        setTestMode(mode);
        setAssetType(asset);

        const generated = [];
        for (let i = 0; i < 10; i++) {
            const target = mode === "char" ? alphabets[Math.floor(Math.random() * 26)] : randomWords[Math.floor(Math.random() * randomWords.length)];
            const options = [target];
            while (options.length < 4) {
                const rand = mode === "char" ? alphabets[Math.floor(Math.random() * 26)] : randomWords[Math.floor(Math.random() * randomWords.length)];
                if (!options.includes(rand)) options.push(rand);
            }
            generated.push({ target, options: options.sort(() => 0.5 - Math.random()) });
        }

        setQuestions(generated);
        setScore(0);
        setCurrentIndex(0);
        setTimeLeft(600);
        setCurrentWordIndex(0);
        setStatus("waiting");
        setTestStarted(true);
    };

    // --- Vision Capture Logic ---
    const handlePrediction = (label, confidence) => {
        lastPrediction.current = { label, conf: confidence };
    };

    const triggerCapture = () => {
        if (status !== "waiting") return;

        setStatus("capturing");
        let count = 3;
        setCaptureTimer(count);

        const timer = setInterval(() => {
            count -= 1;
            setCaptureTimer(count);
            if (count === 0) {
                clearInterval(timer);
                verifySign();
            }
        }, 1000);
    };

    const verifySign = () => {
        const target = testMode === "char" ? questions[currentIndex].target : questions[currentIndex].target[currentWordIndex];
        const { label, conf } = lastPrediction.current;

        if (label.toUpperCase() === target.toUpperCase() && conf > 0.6) {
            setStatus("success");
            setTimeout(() => nextStep(true), 1500);
        } else {
            setStatus("fail");
            setTimeout(() => setStatus("waiting"), 2000);
        }
    };

    const nextStep = (isCorrect) => {
        const targetWord = questions[currentIndex].target;
        if (testMode === "word" && currentWordIndex < targetWord.length - 1) {
            setCurrentWordIndex(prev => prev + 1);
            setStatus("waiting");
        } else {
            if (isCorrect) setScore(prev => prev + 1);
            if (currentIndex < 9) {
                setCurrentIndex(prev => prev + 1);
                setCurrentWordIndex(0);
                setStatus("waiting");
            } else {
                finishTest(score + (isCorrect ? 1 : 0));
            }
        }
    };

    if (!testStarted) {
        return (
            <div style={s.master}>
                <div style={s.card}>
                    <h2 style={s.neonText}>Skill Test Phase 02</h2>
                    <div style={s.setupGrid}>
                        <div style={s.setupSection}>
                            <h3 style={{color: '#38bdf8'}}>MCQ Mode</h3>
                            <button onClick={() => startTest("mcq", "char", "image")} style={s.miniBtn}>Letter MCQ</button>
                            <button onClick={() => startTest("mcq", "word", "image")} style={s.miniBtn}>Word MCQ</button>
                        </div>
                        <div style={s.setupSection}>
                            <h3 style={{color: '#10b981'}}>Vision AI Mode</h3>
                            <button onClick={() => startTest("vision", "char")} style={s.modeBtnVision}>Start Letter Test</button>
                            <button onClick={() => startTest("vision", "word")} style={s.modeBtnVision}>Start Word Test</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (testFinished) {
        return (
            <div style={s.master}>
                <div style={s.card}>
                    <h1 style={s.neonText}>Result: {score}/10</h1>
                    <button onClick={() => setTestStarted(false)} style={s.startBtn}>Back</button>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div style={s.master}>
            <div style={s.statusBar}>
                <span>Q {currentIndex + 1}/10</span>
                <span>Time: {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</span>
            </div>

            {testType === "mcq" ? (
                <div style={s.mcqContainer}>
                    <h1 style={s.targetBig}>{currentQ.target}</h1>
                    <div style={s.optionsGrid}>
                        {currentQ.options.map((opt, i) => (
                            <div key={i} onClick={() => {
                                const isCorrect = opt === currentQ.target;
                                setScore(prev => isCorrect ? prev + 1 : prev);
                                if (currentIndex < 9) setCurrentIndex(prev => prev + 1);
                                else finishTest(score + (isCorrect ? 1 : 0));
                            }} style={s.optionCard}>
                                {/* 🛠️ FIXED: Yahan ab word ke sare signs dikhenge */}
                                <div style={s.signGrid}>
                                    {opt.split("").map((char, idx) => (
                                        <img key={idx} src={`http://127.0.0.1:5000/static/asl_images/${char.toUpperCase()}/${char.toUpperCase()}.jpg`} style={s.signThumb} alt="sign" />
                                    ))}
                                </div>
                                <div style={s.optLabel}>Option {i+1}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={s.grid}>
                    <div style={s.camWrapper}>
                        <Recognition onPredict={handlePrediction} isEnabled={testStarted} />
                        {status === "capturing" && <div style={s.timerOverlay}>{captureTimer}</div>}
                        {status === "success" && <div style={s.successOverlay}>CORRECT ✓</div>}
                        {status === "fail" && <div style={s.failOverlay}>WRONG ✗ TRY AGAIN</div>}
                    </div>
                    <div style={s.controlPanel}>
                        <div style={s.targetCard}>
                            <h2 style={{color: '#94a3b8'}}>Show Sign For:</h2>
                            <h1 style={s.targetText}>
                                {testMode === "char" ? currentQ.target : currentQ.target.split("").map((l, i) => (
                                    <span key={i} style={{color: i === currentWordIndex ? '#38bdf8' : i < currentWordIndex ? '#10b981' : '#1e293b'}}>{l}</span>
                                ))}
                            </h1>
                        </div>
                        <button onClick={triggerCapture} disabled={status !== "waiting"} style={status === "waiting" ? s.captureBtn : s.disabledBtn}>
                            {status === "waiting" ? "CAPTURE SIGN" : "VERIFYING..."}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const s = {
    master: { paddingTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', background: '#020617', color: '#f8fafc' },
    card: { background: '#0f172a', padding: '40px', borderRadius: '28px', border: '1px solid #1e293b', width: '90%', maxWidth: '800px', textAlign: 'center' },
    neonText: { color: '#38bdf8', fontSize: '2.5rem', fontWeight: '900' },
    setupGrid: { display: 'flex', gap: '20px', marginTop: '30px' },
    setupSection: { flex: 1, background: '#1e293b', padding: '20px', borderRadius: '20px' },
    miniBtn: { width: '100%', background: '#0f172a', color: '#38bdf8', border: '1px solid #38bdf8', padding: '10px', borderRadius: '10px', marginTop: '10px', cursor: 'pointer' },
    modeBtnVision: { width: '100%', background: '#10b981', color: '#000', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' },
    targetBig: { fontSize: '5rem', color: '#fff', marginBottom: '30px' },
    optionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' },
    optionCard: { background: '#0f172a', padding: '15px', borderRadius: '20px', border: '1px solid #1e293b', cursor: 'pointer' },
    signGrid: { display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center', background: '#fff', padding: '10px', borderRadius: '10px', minHeight: '80px' },
    signThumb: { width: '40px', height: '40px', objectFit: 'contain' },
    optLabel: { marginTop: '10px', color: '#94a3b8', fontSize: '0.8rem' },
    grid: { display: 'flex', gap: '30px', width: '90%' },
    camWrapper: { position: 'relative', width: '500px', borderRadius: '24px', overflow: 'hidden', background: '#000' },
    timerOverlay: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8rem', color: '#fff', background: 'rgba(0,0,0,0.5)', z_index: 10 },
    successOverlay: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#10b981', background: 'rgba(16,185,129,0.2)', fontWeight: 'bold' },
    failOverlay: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#ef4444', background: 'rgba(239,68,68,0.2)', fontWeight: 'bold' },
    controlPanel: { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' },
    targetCard: { background: '#0f172a', padding: '30px', borderRadius: '24px', border: '1px solid #1e293b' },
    targetText: { fontSize: '5rem', color: '#fff', margin: 0 },
    captureBtn: { background: '#38bdf8', color: '#000', padding: '20px', borderRadius: '15px', fontSize: '1.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
    disabledBtn: { background: '#1e293b', color: '#64748b', padding: '20px', borderRadius: '15px', border: 'none' },
    statusBar: { width: '90%', display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#38bdf8', fontWeight: 'bold' },
    startBtn: { background: '#38bdf8', color: '#000', padding: '10px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer' }
};

export default Phase2Test;