import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- Layout Components ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// --- Pages & Core Modules ---
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import About from './components/About';
import RealTimeMode from './components/RealTimeMode'; // ✅ New Real-Time Page

// --- Learning & Testing Modules ---
import ImageMode from './components/ImageMode';
import VideoPlayer from './components/VideoPlayer';
import Phase1Test from './components/Phase1Test';
import Phase2Test from './components/Phase2Test';
import SmartMode from './components/SmartMode';
// --- Global Protection Logic ---
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('userToken');
    return token ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <Router>
      {/* Main Wrapper with Background Sync */}
      <div className="app-main-wrapper" style={{ background: '#020617', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Navigation Bar Fixed at Top */}
        <Navbar />

        {/* --- Content Hub --- */}
        <div className="content-body" style={{ flex: 1 }}>
          <Routes>
            {/* Public Access Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />

            {/* AI Learning Modules (Protected) */}
            <Route path="/image-mode" element={
                <ProtectedRoute> <ImageMode /> </ProtectedRoute>
            } />

            {/* Dedicated Real-Time Neural Translation */}
            <Route path="/real-time" element={
                <ProtectedRoute>
                    <RealTimeMode />
                </ProtectedRoute>
            } />

            {/* Static Video Reference Page */}
            <Route path="/video-mode" element={
                <ProtectedRoute>
                    <div className="center-layout" style={{ paddingTop: '100px', display: 'flex', justifyContent: 'center' }}>
                        <VideoPlayer word="SIGN BRIDGE" videoUrl="http://127.0.0.1:5000/static/isl_videos/A.mp4" />
                    </div>
                </ProtectedRoute>
            } />

            {/* Assessment Phase 01: Identification & Typing */}
            <Route path="/test" element={
                <ProtectedRoute>
                    <Phase1Test />
                </ProtectedRoute>
            } />

            {/* Assessment Phase 02: Vision AI & MCQ Selection */}
            <Route path="/test-phase2" element={
                <ProtectedRoute>
                    <Phase2Test />
                </ProtectedRoute>
            } />
            <Route path="/smart-mode" element={<SmartMode />} />

            {/* Student Analytics Dashboard */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />

            {/* 404 Redirect Logic */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;