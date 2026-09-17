import React, { useState, useEffect } from 'react';

const Phase1Test = () => {
    const [testStarted, setTestStarted] = useState(false);
    const [testMode, setTestMode] = useState("char");
    const [displayType, setDisplayType] = useState("image");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [userAnswer, setUserAnswer] = useState("");
    const [results, setResults] = useState([]);
    const [timeLeft, setTimeLeft] = useState(600);
    const [testFinished, setTestFinished] = useState(false);

    const [videoSubIndex, setVideoSubIndex] = useState(0);
    const [showStatus, setShowStatus] = useState(null);

    const randomWords = ["HELLO", "SIGN", "APPLE", "INDIA", "WATER", "BREAD", "HAPPY", "HOME", "WORK", "NAME"];
    const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const startTest = (mode, type) => {
        let generatedQuestions = [];
        if (mode === "char") {
            const shuffled = [...alphabets].sort(() => 0.5 - Math.random()).slice(0, 10);
            generatedQuestions = shuffled.map(char => ({
                label: char,
                letters: [char],
                images: [`http://127.0.0.1:5000/static/asl_images/${char}/${char}.jpg`],
                videos: [`http://127.0.0.1:5000/static/isl_videos/${char}.mp4`]
            }));
        } else {
            const shuffledWords = [...randomWords].sort(() => 0.5 - Math.random()).slice(0, 10);
            generatedQuestions = shuffledWords.map(word => {
                const wordLetters = word.split("");
                return {
                    label: word,
                    letters: wordLetters,
                    images: wordLetters.map(l => `http://127.0.0.1:5000/static/asl_images/${l}/${l}.jpg`),
                    videos: wordLetters.map(l => `http://127.0.0.1:5000/static/isl_videos/${l}.mp4`)
                };
            });
        }
        setQuestions(generatedQuestions);
        setTestMode(mode);
        setDisplayType(type);
        setTestStarted(true);
        setTestFinished(false);
        setCurrentIndex(0);
        setVideoSubIndex(0);
        setResults([]);
        setTimeLeft(600);
    };

    useEffect(() => {
        let timer;
        if (testStarted && !testFinished && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && testStarted && !testFinished) {
            finishTest(results);
        }
        return () => clearInterval(timer);
    }, [testStarted, testFinished, timeLeft, results]);

    const handleVideoEnded = () => {
        const currentQuestion = questions[currentIndex];
        if (videoSubIndex < currentQuestion.videos.length - 1) {
            setVideoSubIndex(prev => prev + 1);
            setShowStatus(null);
        } else {
            setShowStatus('END');
            setTimeout(() => {
                setVideoSubIndex(0);
                setShowStatus('START');
                setTimeout(() => setShowStatus(null), 800);
            }, 800);
        }
    };

    // --- Data Saving Logic ---
    const finishTest = (finalResults) => {
        const score = finalResults.filter(r => r.correct).length;

        // Save to LocalStorage for Dashboard
        const history = JSON.parse(localStorage.getItem('isl_test_history')) || [];
        history.push({
            type: "Phase 1",
            mode: testMode === 'char' ? "Char Mode" : "Word Mode",
            score: score,
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem('isl_test_history', JSON.stringify(history));

        setTestFinished(true);
    };

    const handleNext = () => {
        const isCorrect = userAnswer.toUpperCase().trim() === questions[currentIndex].label;
        const updatedResults = [...results, { q: questions[currentIndex].label, ans: userAnswer, correct: isCorrect }];
        setResults(updatedResults);

        if (currentIndex < 9) {
            setCurrentIndex(prev => prev + 1);
            setVideoSubIndex(0);
            setUserAnswer("");
            setShowStatus('START');
            setTimeout(() => setShowStatus(null), 800);
        } else {
            finishTest(updatedResults); // Call save function here
        }
    };

    // UI Logic (Same as your clean version)
    if (!testStarted) {
        return (
            <div style={styles.master}>
                <div style={styles.card}>
                    <h2 style={styles.neonText}>Skill Test Hub</h2>
                    <div style={{marginBottom: '20px'}}>
                        <p style={styles.label}>1. Select Mode</p>
                        <button onClick={() => setTestMode("char")} style={testMode === "char" ? styles.activeMode : styles.modeBtn}>Letter (A-Z)</button>
                        <button onClick={() => setTestMode("word")} style={testMode === "word" ? styles.activeMode : styles.modeBtn}>Word (ISL)</button>
                    </div>
                    <div style={{marginBottom: '40px'}}>
                        <p style={styles.label}>2. Select Asset Type</p>
                        <button onClick={() => setDisplayType("image")} style={displayType === "image" ? styles.activeMode : styles.modeBtn}>🖼️ Images</button>
                        <button onClick={() => setDisplayType("video")} style={displayType === "video" ? styles.activeMode : styles.modeBtn}>🎥 Animation</button>
                    </div>
                    <button onClick={() => startTest(testMode, displayType)} style={styles.startBtn}>START 10-MIN TEST</button>
                </div>
            </div>
        );
    }

    if (testFinished) {
        const score = results.filter(r => r.correct).length;
        return (
            <div style={styles.master}>
                <div style={styles.card}>
                    <h2 style={styles.neonText}>Test Results</h2>
                    <div style={styles.scoreCircle}><span>{score}</span>/10</div>
                    <div style={styles.resultScroll}>
                        {results.map((r, i) => (
                            <div key={i} style={{color: r.correct ? '#4ade80' : '#fb7185', padding: '10px', borderBottom: '1px solid #1e293b'}}>
                                {i+1}. Target: {r.q} | Your Answer: {r.ans || "---"} {r.correct ? '✓' : '✗'}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setTestStarted(false)} style={styles.startBtn}>Back to Dashboard</button>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div style={styles.master}>
            <div style={styles.statusBar}>
                <div style={{color: timeLeft < 60 ? '#fb7185' : '#38bdf8'}}>⏱ {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</div>
                <div style={{color: '#38bdf8'}}>Question {currentIndex + 1}/10</div>
            </div>

            <div style={styles.card}>
                <div style={styles.mediaBox}>
                    {displayType === "image" ? (
                        <div style={styles.imageGrid}>
                            {currentQ.images.map((src, idx) => (
                                <div key={idx} style={styles.miniImgWrapper}>
                                    <img src={src} alt="Sign" style={styles.miniImg} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={styles.videoPlayerWrap}>
                            <div style={styles.videoBadge}>
                                Sign: {videoSubIndex + 1} of {currentQ.letters.length}
                                {showStatus && <span style={styles.statusOverlay}>{showStatus}</span>}
                            </div>
                            <video
                                key={`${currentIndex}-${videoSubIndex}`}
                                autoPlay
                                onEnded={handleVideoEnded}
                                muted
                                style={styles.mediaElement}
                            >
                                <source src={currentQ.videos[videoSubIndex]} type="video/mp4" />
                            </video>
                        </div>
                    )}
                </div>

                <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type the full word/letter..."
                    style={styles.input}
                    autoFocus
                    onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                />

                <button onClick={handleNext} style={styles.startBtn}>
                    {currentIndex === 9 ? "FINISH TEST" : "NEXT QUESTION →"}
                </button>
            </div>
        </div>
    );
};

const styles = {
    master: { paddingTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', background: '#020617', color: '#f8fafc' },
    card: { background: 'rgba(15, 23, 42, 0.9)', padding: '40px', borderRadius: '28px', border: '1px solid #38bdf833', width: '95%', maxWidth: '650px', textAlign: 'center', position: 'relative' },
    neonText: { color: '#fff', fontSize: '2.4rem', fontWeight: '900', marginBottom: '10px' },
    label: { color: '#38bdf8', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '10px', textTransform: 'uppercase' },
    modeBtn: { background: '#0f172a', border: '1px solid #38bdf844', color: '#94a3b8', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', margin: '5px' },
    activeMode: { background: '#38bdf8', border: '1px solid #38bdf8', color: '#020617', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', margin: '5px', fontWeight: 'bold' },
    startBtn: { background: 'linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%)', color: '#fff', padding: '15px', border: 'none', borderRadius: '14px', fontWeight: 'bold', width: '100%', cursor: 'pointer', marginTop: '10px' },
    mediaBox: { width: '100%', background: '#fff', borderRadius: '20px', padding: '15px', marginBottom: '25px', display: 'flex', justifyContent: 'center', minHeight: '220px', alignItems: 'center', position: 'relative' },
    imageGrid: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' },
    miniImgWrapper: { width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '8px', padding: '4px' },
    miniImg: { width: '100%', height: '100%', objectFit: 'contain' },
    videoPlayerWrap: { textAlign: 'center', position: 'relative' },
    videoBadge: { background: '#020617', color: '#38bdf8', padding: '6px 15px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' },
    statusOverlay: { color: '#fb7185', background: 'rgba(251, 113, 133, 0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid #fb7185' },
    mediaElement: { maxWidth: '100%', maxHeight: '180px', borderRadius: '10px' },
    input: { width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #38bdf8', background: '#0f172a', color: '#fff', textAlign: 'center', fontSize: '1.3rem', marginBottom: '20px', outline: 'none' },
    statusBar: { width: '100%', maxWidth: '650px', display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontWeight: 'bold', fontSize: '1.1rem' },
    scoreCircle: { width: '120px', height: '120px', border: '5px solid #38bdf8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px auto', fontSize: '2.5rem', fontWeight: 'bold' },
    resultScroll: { maxHeight: '250px', overflowY: 'auto', textAlign: 'left', marginBottom: '20px' }
};

export default Phase1Test;