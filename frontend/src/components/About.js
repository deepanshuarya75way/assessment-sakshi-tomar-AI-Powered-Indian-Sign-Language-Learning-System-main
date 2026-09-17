import React from 'react';

const About = () => {
    const stats = [
        { val: '92.3%', label: 'Prediction Accuracy', color: '#38bdf8' },
        { val: '26', label: 'Alphabet Dataset', color: '#818cf8' },
        { val: '150+', label: 'ISL Vocabulary', color: '#c084fc' },
        { val: '< 30ms', label: 'Real-time Latency', color: '#fb7185' },
    ];

    const team = [
        { name: 'Sakshi Tomar', role: 'Lead Developer' },
        { name: 'Asshu', role: 'AI Researcher' },
    ];

    return (
        <div style={s.master}>
            <div style={s.container}>
                {/* --- 🚀 1. Hero Section --- */}
                <header style={s.header}>
                    <div style={s.brandBadge}>SIGN BRIDGE AI v3.1</div>
                    <h1 style={s.neonText}>Bridging Silence <br /> <span style={s.gradientText}>with Intelligence</span></h1>
                    <p style={s.subText}>
                        An advanced Computer Vision project designed to interpret Indian Sign Language (ISL) using
                        deep learning and real-time hand-tracking technology.
                    </p>
                </header>

                {/* --- 📊 2. Impact Stats --- */}
                <div style={s.statsGrid}>
                    {stats.map((s_obj, i) => (
                        <div key={i} style={s.statCard}>
                            <h3 style={{...s.statVal, color: s_obj.color}}>{s_obj.val}</h3>
                            <p style={s.statLabel}>{s_obj.label}</p>
                        </div>
                    ))}
                </div>

                {/* --- 👁️‍🗨️ 3. Project Overview --- */}
                <section style={s.visionSection}>
                    <div style={s.textCard}>
                        <h3 style={s.sectionTitle}>Project Overview</h3>
                        <p style={s.description}>
                            <b>Sign Bridge AI</b> is a state-of-the-art Sign Language recognition toolkit.
                            Leveraging the power of <b>MediaPipe</b> and <b>TensorFlow</b>, this system translates
                            dynamic hand gestures into text and audio. It features a dual-phase assessment hub
                            where users can learn the alphabet and test their skills via AI Vision verification,
                            making communication more inclusive for the Deaf and Hard-of-Hearing community in India.
                        </p>
                    </div>
                </section>

                {/* --- 👥 4. Team & Mentorship (The New Section) --- */}
                <section style={s.teamSection}>
                    <h3 style={s.sectionTitle}>Developed By</h3>
                    <div style={s.teamGrid}>
                        {team.map((member, i) => (
                            <div key={i} style={s.teamCard}>
                                <h4 style={s.memberName}>{member.name}</h4>
                                <p style={s.memberRole}>{member.role}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- 🤖 5. How it Works --- */}
                <section style={s.featureGrid}>
                    <div style={s.cardGlass}>
                        <div style={s.iconBox}>👁️</div>
                        <h4 style={s.cardTitle}>Gesture Recognition</h4>
                        <p style={s.cardDesc}>Captures 21 distinct hand landmarks for high-fidelity tracking.</p>
                    </div>
                    <div style={s.cardGlass}>
                        <div style={s.iconBox}>🧠</div>
                        <h4 style={s.cardTitle}>Neural Processing</h4>
                        <p style={s.cardDesc}>LSTM & CNN models analyze spatial-temporal hand movements.</p>
                    </div>
                    <div style={s.cardGlass}>
                        <div style={s.iconBox}>📝</div>
                        <h4 style={s.cardTitle}>Real-time Feedback</h4>
                        <p style={s.cardDesc}>Instant text-to-speech and visual output for seamless interaction.</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

const s = {
    master: { paddingTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: "'Inter', sans-serif" },
    container: { width: '95%', maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '60px', paddingBottom: '80px', textAlign:'center' },
    header: { maxWidth: '800px', margin: '0 auto', display:'flex', flexDirection:'column', alignItems:'center' },
    brandBadge: { background: '#38bdf8', color: '#020617', padding: '5px 15px', borderRadius: '50px', display: 'inline-block', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '20px' },
    neonText: { color: '#fff', fontSize: '3.5rem', fontWeight: '900', lineHeight: '1.1' },
    gradientText: { background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subText: { margin: '20px auto 0 auto', color: '#94a3b8', fontSize: '1.2rem', maxWidth: '650px', lineHeight: '1.5' },

    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
    statCard: { background: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid rgba(56,189,248,0.1)' },
    statVal: { margin: '0 0 5px 0', fontSize: '2.2rem', fontWeight: '900' },
    statLabel: { margin: 0, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' },

    visionSection: { display: 'flex', justifyContent: 'center' },
    textCard: { background: '#0f172a', padding: '40px', borderRadius: '24px', border: '1px solid #1e293b', maxWidth: '800px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' },
    sectionTitle: { fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '30px', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '2px' },
    description: { color: '#f8fafc', fontSize: '1.1rem', lineHeight: '1.7', textAlign:'justify' },

    teamSection: { padding: '20px 0' },
    teamGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '40px' },
    teamCard: { background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' },
    memberName: { fontSize: '1.1rem', color: '#fff', margin: '0 0 5px 0' },
    memberRole: { fontSize: '0.8rem', color: '#38bdf8', margin: 0 },

    guideBox: { borderTop: '1px solid #1e293b', paddingTop: '30px', maxWidth: '400px', margin: '0 auto' },
    guideName: { fontSize: '1.4rem', color: '#fff', margin: '5px 0' },
    guideTitle: { fontSize: '0.9rem', color: '#818cf8', margin: 0 },

    featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' },
    cardGlass: { background: 'rgba(56,189,248,0.02)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' },
    iconBox: { fontSize: '2rem', marginBottom: '15px' },
    cardTitle: { fontSize: '1.1rem', marginBottom: '10px', color: '#fff' },
    cardDesc: { color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }
};

export default About;