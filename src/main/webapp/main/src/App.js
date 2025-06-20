import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import MainPage from './pages/MainPage';
import TodakiPage from './pages/TodakiPage';
import SelfCheckPage from './pages/SelfCheckPage';
import PlantPage from './pages/PlantPage';
import CalendarPage from './pages/CalendarPage';
import BoardPage from './pages/board/BoardPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <h1>토닥</h1>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/todaki" element={<TodakiPage />} />
        <Route path="/self-check" element={<SelfCheckPage />} />
        <Route path="/plant" element={<PlantPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;