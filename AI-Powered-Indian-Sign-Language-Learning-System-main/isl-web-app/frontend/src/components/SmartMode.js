import React, { useState, useEffect } from 'react';

const SmartMode = ({ inputData }) => {
    const [wordBuffer, setWordBuffer] = useState([]);
    const [semanticSentence, setSemanticSentence] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    //  Logic: Buffer management with strict duplicate check
    useEffect(() => {
        // "---" ya empty data ko ignore karne ke liye
        if (inputData && inputData !== "---" && inputData.length > 0) {
            setWordBuffer(prev => {
                // Agar pichla word same hai toh add mat karo (Debouncing)
                if (prev.length > 0 && prev[prev.length - 1] === inputData) {
                    return prev;
                }
                return [...prev, inputData].slice(-6); // Max 6 words
            });
        }
    }, [inputData]);

    const clearBuffer = () => {
        setWordBuffer([]);
        setSemanticSentence("");
    };

    // --- 🧠 Neural Semantic Construction Logic ---
    const constructSentence = () => {
        if (wordBuffer.length === 0) {
            alert("Pehle kuch signs detect hone do bhai!");
            return;
        }

        setIsProcessing(true);

        // AI Processing simulation
        setTimeout(() => {
            const rawSequence = wordBuffer.join(" ").toUpperCase().trim();


            const mapping = {
                "I HOME GO": "I am heading home now.",
                "YOU NAME WHAT": "May I know your name, please?",
                "HELP NEED": "I require some urgent assistance.",
                "WATER DRINK": "I would like to have some water.",
                "HELLO HOW YOU": "Hello, how are you doing today?",
                "EAT FOOD": "I am going to have my meal.",
                "THANK YOU MUCH": "Thank you very much for your help.",
                "WHERE HOSPITAL": "Can you tell me where the hospital is?",
                "I FEEL SICK": "I am not feeling well."
            };

            // ✅ Core Logic: Agar mapping hai toh wo dikhao, varna join kar do
            const result = mapping[rawSequence] ||
                           (wordBuffer.join(" ").charAt(0).toUpperCase() +
                            wordBuffer.join(" ").slice(1).toLowerCase() + ".");

            setSemanticSentence(result);
            setIsProcessing(false);
        }, 1000);
    };

    return (
        <div style={s.smartContainer}>
            <div style={s.smartHeader}>
                <div style={s.flexRow}>
                    <div style={s.aiPulse}></div>
                    <span style={s.title}>NEURAL_SEMANTIC_ENGINE v1.0</span>
                </div>
                <button onClick={clearBuffer} style={s.clearBtn}>RESET_BUFFER</button>
            </div>

            {/* Buffer Window */}
            <div style={s.bufferArea}>
                <small style={s.label}>LIVE_GESTURE_BUFFER:</small>
                <div style={s.chipContainer}>
                    {wordBuffer.length > 0 ? wordBuffer.map((w, i) => (
                        <span key={i} style={s.wordChip}>
                            {w} {i < wordBuffer.length - 1 && "→"}
                        </span>
                    )) : <span style={{color:'#475569', fontSize:'0.8rem'}}>Awaiting gestures from camera...</span>}
                </div>
            </div>

            {/* Process Button */}
            <button
                onClick={constructSentence}
                disabled={wordBuffer.length === 0 || isProcessing}
                style={wordBuffer.length === 0 || isProcessing ? s.disabledBtn : s.constructBtn}
            >
                {isProcessing ? "ANALYZING_NEURAL_NODES..." : "CONSTRUCT_SENTENCE ⚡"}
            </button>

            {/* Result Display */}
            <div style={s.outputBox}>
                <small style={s.label}>SMART_AI_OUTPUT:</small>
                <div style={s.sentenceText}>
                    {semanticSentence || "Sentence will appear here..."}
                </div>
                {semanticSentence && <div style={s.aiBadge}>AI_STRUCTURED</div>}
            </div>

            {/* Test Helper (Aap ise baad mein remove kar sakte ho) */}
            <p style={{fontSize:'0.6rem', color:'#475569', marginTop:'10px', textAlign:'center'}}>
                Tip: Try signs for "I", "HOME", "GO" and click Construct.
            </p>
        </div>
    );
};

const s = {
    smartContainer: { background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(15px)', borderRadius: '24px', padding: '25px', border: '1px solid rgba(56, 189, 248, 0.2)', marginTop: '25px' },
    smartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
    flexRow: { display: 'flex', alignItems: 'center', gap: '8px' },
    aiPulse: { width: '8px', height: '8px', background: '#38bdf8', borderRadius: '50%', boxShadow: '0 0 12px #38bdf8', animation: 'pulse 2s infinite' },
    title: { color: '#38bdf8', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px' },
    clearBtn: { background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '0.6rem', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer' },
    bufferArea: { background: '#020617', padding: '15px', borderRadius: '15px', marginBottom: '15px', border: '1px solid #1e293b' },
    label: { color: '#64748b', fontSize: '0.6rem', fontWeight: 'bold', marginBottom: '8px', display: 'block' },
    chipContainer: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
    wordChip: { color: '#38bdf8', fontSize: '0.9rem', fontWeight: 'bold' },
    constructBtn: { width: '100%', padding: '16px', background: '#38bdf8', color: '#020617', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' },
    disabledBtn: { width: '100%', padding: '16px', background: '#1e293b', color: '#475569', border: 'none', borderRadius: '12px', cursor: 'not-allowed' },
    outputBox: { marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', borderLeft: '4px solid #38bdf8', position: 'relative' },
    sentenceText: { color: '#fff', fontSize: '1.3rem', fontStyle: 'italic', lineHeight: '1.4' },
    aiBadge: { position: 'absolute', top: '10px', right: '15px', fontSize: '0.5rem', background: '#38bdf8', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }
};

export default SmartMode;