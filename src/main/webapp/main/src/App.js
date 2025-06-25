import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";

import Navbar from './components/Navbar';
import MainPage from './pages/MainPage';
import TodakiPage from './pages/TodakiPage';
import SelfCheckPage from './pages/SelfCheckPage';
<<<<<<< HEAD
// import PlantPage from './pages/PlantPage';
=======
import PlantPage from './pages/PlantPage';
>>>>>>> 868494c87004448a8ee2d55d62be8d452cbcc8f6
import CalendarPage from './pages/CalendarPage';

import BoardPage from './pages/board/BoardPage';
import BoardCreatePage from './pages/board/BoardCreatePage';
import NBoardCreatePage from './pages/board/NBoardCreatePage';
import BoardReadPage from './pages/board/BoardReadPage';
import BoardUpdatePage from './pages/board/BoardUpdatePage';
import BoardByCategoryPage from './pages/board/BoardByCategoryPage';

<<<<<<< HEAD
import SignUpPage from './pages/member/SignUpPage';
import LoginPage from './pages/member/LoginPage';
import SignUpPageAdmin from './pages/member/SignUpPageAdmin';
import LoginPageAdmin from './pages/member/LoginPageAdmin';
import MemberListPage from './pages/member/MemberListPage';
import MyPage from './pages/member/MyPage';
import { PlantProvider } from './pages/plant/PlantContext';
import PlantPage from './pages/plant/PlantPage';

// 📦 그 외 페이지
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import NotFoundPage from './pages/NotFoundPage';


=======
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
>>>>>>> 868494c87004448a8ee2d55d62be8d452cbcc8f6

function App() {
  return (
    <Router>
<<<<<<< HEAD
=======
      <h1>토닥</h1>
>>>>>>> 868494c87004448a8ee2d55d62be8d452cbcc8f6
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/todaki" element={<TodakiPage />} />
        <Route path="/self-check" element={<SelfCheckPage />} />
<<<<<<< HEAD
        {/* <Route path="/plant" element={<PlantPage />} /> */}
=======
        <Route path="/plant" element={<PlantPage />} />
>>>>>>> 868494c87004448a8ee2d55d62be8d452cbcc8f6
        <Route path="/calendar" element={<CalendarPage />} />

        <Route path="/board/list_all" element={<BoardPage />} />
        {/* <Route path="/board/create/:categoryno" element={<BoardCreatePage />} /> */}
        <Route path="/board/create/:categoryno" element={<NBoardCreatePage />} />
        <Route path="/board/read/:boardno" element={<BoardReadPage />} />
        <Route path="/board/update/:boardno" element={<BoardUpdatePage />} />
        <Route path="/board/list_category/:categoryno" element={<BoardByCategoryPage />} />

        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
<<<<<<< HEAD
        <Route path="/admin_login" element={<LoginPageAdmin />} />
        <Route path="/admin_signup" element={<SignUpPageAdmin  />} />
        <Route path="/admin/member-list" element={<MemberListPage />} />
        <Route path="/mypage" element={<MyPage />} />
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/login" element={<LoginPage />} />
        {/* ✅ 반려식물 기능은 PlantProvider로 감싸줌 */}
        <Route path="/plant" element={<PlantProvider><PlantPage /></PlantProvider>}/>
        {/* <Route path="*" element={<NotFoundPage />} /> */}


=======
>>>>>>> 868494c87004448a8ee2d55d62be8d452cbcc8f6
      </Routes>
    </Router>
  );
}

export default App;