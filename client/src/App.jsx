import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';

import Welcome from './pages/Welcome';

function App() {
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });

  // Global cursor tracking with Framer Motion spring physics
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const cursorVariants = {
    default: {
      x: mousePosition.x - 300, // Offset by half the width of the 600px glow
      y: mousePosition.y - 300,
      transition: { type: "spring", mass: 0.1, stiffness: 100, damping: 20 }
    }
  };

  return (
    <Router>
      <motion.div className="cursor-glow" variants={cursorVariants} animate="default"></motion.div>
      {/* Navbar sits above all routes automatically */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/analyze" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
