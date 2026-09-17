import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const [time, setTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={s.landingWrapper}>
            <div style={s.bgOverlay}></div>

            {/* --- Main Hero Section --- */}
            <section style={s.heroSection}>
                <div style={s.heroContent}>
                    <div style={s.topBadge}>
                        <span style={s.liveDot}></span> Sign Bridge AI v3.1
                    </div>

                    <h1 style={s.mainTitle}>
                        Bridging Silence <br />
                        <span style={s.gradientText}>With Intelligence</span>
                    </h1>

                    <p style={s.descriptionText}>
                        Experience the future of communication. Our AI-driven engine translates
                        Indian Sign Language in real-time with unparalleled 92.3% precision.
                    </p>

                    <div style={s.actionButtons}>
                        <Link to="/auth" style={s.btnPrimaryGlass}>Get Started Free</Link>
                        <Link to="/video-mode" style={s.btnSecondaryOutline}>Explore Modules</Link>
                    </div>
                </div>

                {/* --- Performance Stats Strip --- */}
                <div style={s.glassStatsBar}>
                    <div style={s.statNode}>
                        <h3 style={s.statTitle}>87K+</h3>
                        <span style={s.statDesc}>Training Samples</span>
                    </div>
                    <div style={s.divider}></div>
                    <div style={s.statNode}>
                        <h3 style={s.statTitle}>22ms</h3>
                        <span style={s.statDesc}>Low Latency</span>
                    </div>
                    <div style={s.divider}></div>
                    <div style={s.statNode}>
                        <h3 style={s.statTitle}>150+</h3>
                        <span style={s.statDesc}>ISL Vocabulary</span>
                    </div>
                </div>

                <div style={s.liveClockPremium}>SYSTEM CORE TIME: {time}</div>
            </section>

            {/* --- Features Section --- */}
            <section style={s.featureShowcase}>
                {[
                    { icon: '🖐️', title: 'Real-time Recognition', desc: 'Powered by MediaPipe landmarks for high-fidelity hand tracking.' },
                    { icon: '🎤', title: 'Audio-to-Sign', desc: 'Seamlessly convert spoken words into visual ISL representations.' },
                    { icon: '📈', title: 'Progress Analytics', desc: 'Track your learning curve with our integrated neural dashboard.' }
                ].map((feat, index) => (
                    <div key={index} style={s.featureCardPremium}>
                        <div style={s.iconBox}>{feat.icon}</div>
                        <h4 style={s.featTitle}>{feat.title}</h4>
                        <p style={s.featDesc}>{feat.desc}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

// --- Futuristic UI Styles with Overlap Fix ---
const s = {
    landingWrapper: {
        minHeight: '100vh',
        background: '#020617',
        color: '#fff',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflowX: 'hidden'
    },
    bgOverlay: {
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.15), transparent 70%)',
        zIndex: 0, pointerEvents: 'none'
    },
    heroSection: {
        paddingTop: '140px', // 👈 FIXED: Navbar overlapping gap
        paddingBottom: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        textAlign: 'center'
    },
    heroContent: { maxWidth: '900px', padding: '0 20px' },
    topBadge: {
        background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf844',
        padding: '8px 20px', borderRadius: '50px', color: '#38bdf8',
        fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '30px', display: 'inline-flex', alignItems: 'center', gap: '10px'
    },
    liveDot: { width: '8px', height: '8px', background: '#38bdf8', borderRadius: '50%', boxShadow: '0 0 10px #38bdf8' },
    mainTitle: { fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: '900', lineHeight: '1.1', marginBottom: '25px', color: '#fff' },
    gradientText: {
        background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
    },
    descriptionText: { fontSize: '1.2rem', color: '#94a3b8', maxWidth: '650px', margin: '0 auto 40px auto', lineHeight: '1.6' },
    actionButtons: { display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' },
    btnPrimaryGlass: {
        background: '#38bdf8', color: '#020617', padding: '16px 35px',
        borderRadius: '12px', fontWeight: '800', textDecoration: 'none', transition: '0.3s', boxShadow: '0 10px 20px rgba(56, 189, 248, 0.3)'
    },
    btnSecondaryOutline: {
        background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '16px 35px',
        borderRadius: '12px', fontWeight: '600', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', transition: '0.3s'
    },
    glassStatsBar: {
        marginTop: '80px', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)',
        padding: '25px 50px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', gap: '40px', alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
    },
    statTitle: { margin: 0, fontSize: '1.8rem', color: '#fff' },
    statDesc: { color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' },
    divider: { width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' },
    liveClockPremium: { marginTop: '40px', fontSize: '0.75rem', color: '#38bdf8', letterSpacing: '4px', opacity: 0.7 },

    featureShowcase: {
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px', width: '90%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px'
    },
    featureCardPremium: {
        background: '#0f172a', padding: '40px', borderRadius: '24px',
        border: '1px solid #1e293b', textAlign: 'center', transition: '0.3s'
    },
    iconBox: { fontSize: '2.5rem', marginBottom: '20px' },
    featTitle: { fontSize: '1.25rem', marginBottom: '15px', color: '#fff' },
    featDesc: { color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }
};

export default LandingPage;