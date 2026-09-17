import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={s.footer}>
            <div style={s.container}>
                {/* --- Brand & Social Section --- */}
                <div style={s.brandSection}>
                    <div style={s.logo}>Sign <span>Bridge</span> <small style={s.logoSmall}>AI</small></div>
                    <p style={s.tagline}>
                        Bridging silence with intelligence. <br />
                        Empowering the ISL community through Neural Networks.
                    </p>
                </div>

                {/* --- Quick Links Grid --- */}
                <div style={s.linksGrid}>
                    <div style={s.linkColumn}>
                        <h4 style={s.columnTitle}>Navigation</h4>
                        <Link to="/image-mode" style={s.footerLink}>Alphabet Mastery</Link>
                        <Link to="/video-mode" style={s.footerLink}>Real-Time Translation</Link>
                        <Link to="/test" style={s.footerLink}>Skill Assessment</Link>
                        <Link to="/about" style={s.footerLink}>About Project</Link>
                    </div>
                    <div style={s.linkColumn}>
                        <h4 style={s.columnTitle}>Account</h4>
                        <Link to="/dashboard" style={s.footerLink}>User Dashboard</Link>
                        <Link to="/auth" style={s.footerLink}>Authentication</Link>
                        <span style={s.versionBadge}>Version 3.1 Stable</span>
                    </div>
                </div>
            </div>

            {/* --- Credits & System Status --- */}
            <div style={s.footerBottom}>
                <div style={s.credits}>
                    <span style={s.teamNames}>
                        Developed by: <b>Sakshi Tomar & Asshu</b>
                    </span>
                </div>

                <div style={s.bottomRow}>
                    <div style={s.status}>
                        <span style={s.statusDot}></span>
                        Neural Core Online | Accuracy: 92.3%
                    </div>
                    <div style={s.copy}>
                        &copy; 2026 Sign Bridge AI. All Rights Reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

// --- Futuristic Footer Styles ---
const s = {
    footer: { background: '#020617', borderTop: '1px solid rgba(56, 189, 248, 0.1)', padding: '60px 0 20px 0', marginTop: 'auto', color: '#f8fafc', fontFamily: "'Inter', sans-serif" },
    container: { width: '90%', maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' },
    brandSection: { flex: '1.5', minWidth: '300px' },
    logo: { fontSize: '1.8rem', fontWeight: '900', marginBottom: '15px' },
    logoSmall: { fontSize: '0.6rem', background: '#38bdf8', color: '#000', padding: '2px 6px', borderRadius: '4px', verticalAlign: 'middle', marginLeft: '5px' },
    tagline: { color: '#94a3b8', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '20px' },

    linksGrid: { flex: '2', display: 'flex', justifyContent: 'space-around', gap: '30px', flexWrap: 'wrap' },
    linkColumn: { display: 'flex', flexDirection: 'column', gap: '12px' },
    columnTitle: { fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px', color: '#fff' },
    footerLink: { color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', transition: '0.3s' },
    versionBadge: { color: '#38bdf8', fontSize: '0.75rem', marginTop: '10px', fontWeight: 'bold' },

    footerBottom: { width: '90%', maxWidth: '1200px', margin: '40px auto 0 auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' },
    credits: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '20px', color: '#94a3b8', fontSize: '0.85rem' },
    teamNames: { letterSpacing: '0.5px' },
    guideName: { color: '#818cf8' },

    bottomRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' },
    status: { fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' },
    statusDot: { width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' },
    copy: { fontSize: '0.75rem', color: '#64748b' }
};

export default Footer;