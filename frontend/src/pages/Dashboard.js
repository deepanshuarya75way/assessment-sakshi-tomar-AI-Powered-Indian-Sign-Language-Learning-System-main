import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement,
    PointElement, LineElement, ArcElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [testHistory, setTestHistory] = useState([]);
    const [userName, setUserName] = useState("User"); // Default name
    const [stats, setStats] = useState({
        avgAccuracy: 0,
        totalTests: 0,
        charsLearned: 0
    });

    // --- 1. Real Data & User Fetching Logic ---
    useEffect(() => {
        // Fetch User Name from LocalStorage (Assuming it was saved during Login/Sign-up)
        // If you save the full user object: const user = JSON.parse(localStorage.getItem('user'));
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setUserName(storedName);
        }

        // Fetch Test History
        const savedHistory = JSON.parse(localStorage.getItem('isl_test_history')) || [];
        setTestHistory([...savedHistory].reverse());

        // Accuracy calculation
        if (savedHistory.length > 0) {
            const totalScore = savedHistory.reduce((acc, curr) => acc + parseInt(curr.score), 0);
            const totalQuestions = savedHistory.length * 10;
            const avg = ((totalScore / totalQuestions) * 100).toFixed(1);

            setStats({
                avgAccuracy: avg,
                totalTests: savedHistory.length,
                charsLearned: 26
            });
        }
    }, []);

    // --- 2. Dynamic Chart Data ---
    const barData = {
        labels: testHistory.slice(0, 5).map((_, i) => `Session ${testHistory.length - i}`),
        datasets: [{
            label: 'Accuracy %',
            data: testHistory.slice(0, 5).map(t => (parseInt(t.score) / 10) * 100),
            backgroundColor: ['#38bdf8', '#818cf8', '#c084fc', '#34d399', '#fb7185'],
            borderRadius: 8,
        }]
    };

    return (
        <div style={s.wrapper}>
            <div style={s.container}>
                {/* Header Section */}
                <header style={s.header}>
                    <div style={s.profileWrap}>
                        {/* Dynamic DiceBear Avatar based on Name */}
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} style={s.avatar} alt="Profile" />
                        <div>
                            <h1 style={s.welcomeText}>Welcome back, {userName}! 📈</h1>
                            <p style={s.subText}>Status: <span style={s.statusTag}>{stats.avgAccuracy > 80 ? 'Neural Master' : 'Advanced Learner'}</span></p>
                        </div>
                    </div>
                    <div style={s.systemStatus}>
                        <div style={s.dot}></div> Model Sync: Real-Time
                    </div>
                </header>

                {/* Real Stats Grid */}
                <div style={s.statsGrid}>
                    <div style={s.statCard}>
                        <p style={s.statLabel}>Average Accuracy</p>
                        <h3 style={{...s.statVal, color: '#38bdf8'}}>{stats.avgAccuracy}%</h3>
                        <span style={s.trendText}>Across {stats.totalTests} assessments</span>
                    </div>
                    <div style={s.statCard}>
                        <p style={s.statLabel}>Curriculum Progress</p>
                        <h3 style={s.statVal}>Active</h3>
                        <span style={s.trendText}>Dataset: 26 Chars | 150 Words</span>
                    </div>
                    <div style={s.statCard}>
                        <p style={s.statLabel}>Total Tests Taken</p>
                        <h3 style={s.statVal}>{stats.totalTests}</h3>
                        <span style={s.trendText}>Keep it up, {userName}!</span>
                    </div>
                </div>

                {/* Charts Area */}
                <div style={s.chartGrid}>
                    <div style={s.chartBox}>
                        <h4 style={s.boxTitle}>Performance Analysis (Last 5 Tests)</h4>
                        {testHistory.length > 0 ? (
                            <Bar data={barData} options={chartOptions} />
                        ) : (
                            <p style={{color:'#64748b', textAlign:'center', marginTop:'80px'}}>No assessment history available yet.</p>
                        )}
                    </div>
                </div>

                {/* Activity Log */}
                <div style={s.historySection}>
                    <h4 style={s.boxTitle}>Recent Test Records</h4>
                    <div style={s.logList}>
                        {testHistory.length > 0 ? testHistory.map((log, i) => (
                            <div key={i} style={s.logItem}>
                                <div style={s.logIcon}>{log.type.includes('1') ? '📝' : '👁️'}</div>
                                <div style={{flex: 1}}>
                                    <p style={s.logTitle}><b>{log.type}</b> ({log.mode})</p>
                                    <small style={s.logDate}>{log.date || 'Recent Session'}</small>
                                </div>
                                <div style={{...s.logScore, color: parseInt(log.score) >= 8 ? '#10b981' : '#fb7185'}}>
                                    {log.score}/10
                                </div>
                            </div>
                        )) : (
                            <p style={{color:'#64748b', padding:'20px'}}>No records found. Complete a Skill Test to see results.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Chart Configuration ---
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
        x: { grid: { display: false }, ticks: { color: '#64748b' } }
    },
    plugins: { legend: { display: false } }
};

// --- Styles ---
const s = {
    wrapper: { paddingTop: '90px', background: '#020617', minHeight: '100vh', display: 'flex', justifyContent: 'center', color: '#f8fafc', fontFamily: "'Inter', sans-serif" },
    container: { width: '95%', maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '25px', paddingBottom: '50px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' },
    profileWrap: { display: 'flex', gap: '20px', alignItems: 'center' },
    avatar: { width: '65px', height: '65px', borderRadius: '50%', border: '2px solid #38bdf8', padding: '2px' },
    welcomeText: { margin: 0, fontSize: '1.6rem', fontWeight: '900' },
    subText: { margin: '5px 0 0 0', color: '#94a3b8' },
    statusTag: { background: 'rgba(56,189,248,0.1)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' },
    systemStatus: { background: '#0f172a', padding: '8px 15px', borderRadius: '50px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #1e293b' },
    dot: { width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
    statCard: { background: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b' },
    statLabel: { margin: 0, color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase' },
    statVal: { margin: '10px 0', fontSize: '2rem', fontWeight: '900' },
    trendText: { fontSize: '0.8rem', color: '#64748b' },
    chartGrid: { display: 'flex', width: '100%' },
    chartBox: { width: '100%', background: '#0f172a', padding: '25px', borderRadius: '24px', height: '350px', border: '1px solid #1e293b' },
    boxTitle: { margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: '700' },
    historySection: { background: '#0f172a', padding: '25px', borderRadius: '24px', border: '1px solid #1e293b' },
    logList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    logItem: { display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '15px' },
    logIcon: { fontSize: '1.2rem', background: '#1e293b', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' },
    logTitle: { margin: 0, fontSize: '0.95rem', fontWeight: '600' },
    logDate: { color: '#64748b', fontSize: '0.85rem' },
    logScore: { fontWeight: '800', fontSize: '1.1rem' }
};

export default Dashboard;