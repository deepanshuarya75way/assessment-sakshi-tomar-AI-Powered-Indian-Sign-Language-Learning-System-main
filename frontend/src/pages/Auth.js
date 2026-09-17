import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);

        const endpoint = isLogin ? '/api/login' : '/api/signup';

        try {
            const response = await axios.post(`http://127.0.0.1:5000${endpoint}`, formData);

            if (isLogin) {
                localStorage.setItem('userToken', response.data.token);
                // Backend provides user name, otherwise fallback to "Sakshi Tomar"
                localStorage.setItem('userName', response.data.user || "Sakshi Tomar");
                navigate('/dashboard');
            } else {
                alert("Account created successfully! Now please login.");
                setIsLogin(true);
                setLoading(false);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Connection Error: Is your Flask Server running?");
            setLoading(false);
        }
    };

    return (
        <div style={s.pageWrapper}>
            <div style={s.splitGrid}>
                {/* --- Left Side: Branding & Info --- */}
                <div style={s.infoPanel}>
                    <div style={s.glassContent}>
                        <div style={s.brandBadge}>Sign Bridge AI v3.1</div>
                        <h2 style={s.infoTitle}>
                            {isLogin ? "Bridging Silence with Intelligence" : "Join the Neural Revolution"}
                        </h2>
                        <p style={s.infoDesc}>
                            {isLogin
                                ? "Access your personalized dashboard, track learning milestones, and verify gestures with real-time AI."
                                : "Create your profile to unlock Skill Tests and save your real-time analytics."}
                        </p>
                        <div style={s.statsRow}>
                            <div style={s.statItem}><b>92.3%</b> Accuracy</div>
                            <div style={s.statItem}><b>24/7</b> Neural Sync</div>
                        </div>
                    </div>
                </div>

                {/* --- Right Side: Modern Form --- */}
                <div style={s.formPanel}>
                    <div style={s.formBox}>
                        {/* --- LexiSign Branding Updated to Sign Bridge --- */}
                        <div style={s.logoWrap}>
                            ✨ Sign <span>Bridge</span> <small style={s.logoSmall}>AI</small>
                        </div>

                        <h1 style={s.formTitle}>{isLogin ? 'Sign In' : 'Sign Up'}</h1>
                        <p style={s.formSubtitle}>Access your Neural Dashboard</p>

                        <form onSubmit={handleAuth} style={s.formLayout}>
                            {!isLogin && (
                                <div style={s.inputGroup}>
                                    <label style={s.label}>Full Name</label>
                                    <input
                                        type="text"
                                        name="fullname"
                                        placeholder="e.g. Sakshi Tomar"
                                        style={s.input}
                                        value={formData.fullname}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}
                            <div style={s.inputGroup}>
                                <label style={s.label}>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    style={s.input}
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div style={s.inputGroup}>
                                <label style={s.label}>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    style={s.input}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button type="submit" style={s.submitBtn} disabled={loading}>
                                {loading ? 'SYNCING...' : (isLogin ? 'Enter Dashboard' : 'Initialize Account')}
                            </button>
                        </form>

                        <div style={s.toggleContainer}>
                            <span style={{color: '#94a3b8'}}>{isLogin ? "Don't have an account?" : "Already registered?"}</span>
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                style={s.toggleBtn}
                            >
                                {isLogin ? 'Create one now' : 'Sign in here'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Futuristic UI Styles ---
const s = {
    pageWrapper: {
        minHeight: '100vh',
        width: '100vw',
        background: '#020617',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
        paddingTop: '80px', // 👈 FIXED: Navbar overlapping fix
        boxSizing: 'border-box'
    },
    splitGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        width: '100%',
        minHeight: 'calc(100vh - 80px)'
    },
    infoPanel: {
        background: 'linear-gradient(rgba(2, 6, 23, 0.7), rgba(2, 6, 23, 0.7)), url("https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80")',
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
    },
    glassContent: {
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        padding: '50px',
        borderRadius: '30px',
        border: '1px solid rgba(255,255,255,0.1)',
        maxWidth: '500px'
    },
    brandBadge: { background: '#38bdf8', color: '#020617', padding: '5px 15px', borderRadius: '50px', display: 'inline-block', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '20px' },
    infoTitle: { color: '#fff', fontSize: '2.5rem', fontWeight: '900', marginBottom: '20px', lineHeight: '1.2' },
    infoDesc: { color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px' },
    statsRow: { display: 'flex', gap: '20px', color: '#38bdf8' },
    statItem: { padding: '10px 20px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)', fontSize: '0.9rem' },

    formPanel: { background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' },
    formBox: { width: '100%', maxWidth: '400px' },
    logoWrap: { fontSize: '1.8rem', fontWeight: '900', color: '#fff', marginBottom: '40px' },
    logoSmall: { fontSize: '0.6rem', background: '#38bdf8', color: '#000', padding: '2px 6px', borderRadius: '4px', marginLeft: '5px', verticalAlign: 'middle' },
    formTitle: { color: '#fff', fontSize: '2rem', fontWeight: '800', marginBottom: '10px' },
    formSubtitle: { color: '#64748b', marginBottom: '30px' },
    formLayout: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' },
    input: { background: '#0f172a', border: '1px solid #1e293b', padding: '15px', borderRadius: '12px', color: '#fff', outline: 'none', transition: '0.3s' },
    submitBtn: { background: 'linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%)', color: '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: '0 10px 20px rgba(56, 189, 248, 0.2)' },
    toggleContainer: { marginTop: '30px', textAlign: 'center', fontSize: '0.9rem' },
    toggleBtn: { background: 'none', border: 'none', color: '#38bdf8', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px' }
};

export default Auth;