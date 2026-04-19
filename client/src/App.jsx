import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';

import Welcome from './pages/Welcome';

function App() {
  return (
    <Router>
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
