import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userName, setUserName] = useState("User");
    const isLoggedIn = localStorage.getItem('userToken');

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) setUserName(storedName);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userName');
        navigate('/auth');
    };

    const isHomePage = location.pathname === "/";
    const isActive = (path) => location.pathname === path ? 'active-link' : '';

    return (
        <nav className={`navbar-modern ${isHomePage ? 'navbar-transparent' : 'navbar-solid'}`}>
            <div className="nav-container">
                {/* --- Branding --- */}
                <Link to="/" className="nav-logo-premium">
                    <div className="logo-icon">✨</div>
                    <div className="logo-text">
                        Sign <span>Bridge</span> <small>AI</small>
                    </div>
                </Link>

                <div className="nav-menu">
                    <ul className="nav-list">
                        {isLoggedIn && (
                            <li>
                                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
                                    Dashboard
                                </Link>
                            </li>
                        )}
                        <li><Link to="/image-mode" className={`nav-link ${isActive('/image-mode')}`}>Learning Hub</Link></li>
                        <li><Link to="/video-mode" className={`nav-link ${isActive('/video-mode')}`}>AI Translation Engine</Link></li>

                        {/* MERGED SKILL TEST DROPDOWN */}
                        <li className="nav-item-dropdown">
                            <span className={`nav-link dropdown-trigger ${location.pathname.includes('test') ? 'active-link' : ''}`}>
                                Skill Test <small className="arrow-down">▼</small>
                            </span>
                            <div className="dropdown-menu-premium">
                                <Link to="/test" className="dropdown-item">
                                    <span className="item-icon">📝</span>
                                    <div className="item-text">
                                        <strong>Phase 01</strong>
                                        <small>Basic Assessment</small>
                                    </div>
                                </Link>
                                <Link to="/test-phase2" className="dropdown-item">
                                    <span className="item-icon">🤖</span>
                                    <div className="item-text">
                                        <strong>Phase 02</strong>
                                        <small>AI Vision Test</small>
                                    </div>
                                </Link>

                            </div>

                            </li>

                        <li><Link to="/real-time" className={`nav-link ${isActive('/real-time')}`}>Real-Time mode</Link></li>
                        <li><Link to="/about" className={`nav-link ${isActive('/about')}`}>About</Link></li>
                    </ul>

                    <div className="nav-actions">
                        {isLoggedIn ? (
                            <div className="user-nav-wrap">
                                <Link to="/dashboard" className="profile-badge">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
                                        alt="User"
                                    />
                                    <span className="nav-user-name">{userName.split(" ")[0]}</span>
                                </Link>
                                <button onClick={handleLogout} className="btn-logout-minimal">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/auth" className="btn-auth-premium">Sign In</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;