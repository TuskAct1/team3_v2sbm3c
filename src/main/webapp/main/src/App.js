import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css";

import Navbar from './components/Navbar';
import MainPage from './pages/MainPage';
import TodakiPage from './pages/TodakiPage';
import PersonalityTest from './pages/personality_test/PersonalityTest';
import SeniorTest from './pages/personality_test/SeniorTest';
import SeniorTestResult from './pages/personality_test/SeniorTestResult';
import MBTITest from './pages/personality_test/MBTITest';
import MBTIResult from './pages/personality_test/MBTIResult';
import TwoweekQuestionnaire from './pages/personality_test/TwoweekQuestionnaire';
import TwoweekResult from './pages/personality_test/TwoweekResult';
import SeniorTestList from './pages/personality_test/SeniorTestList';
import TwoweekResultList from './pages/personality_test/TwoweekResultList';
import HobbyTest from './pages/personality_test/HobbyTest';
import MemoryTest from './pages/personality_test/MemoryTest';
import MemoryResult from './pages/personality_test/MemoryResult';
import LifestyleTest from './pages/personality_test/LifestyleTest';
import LifestyleResult from './pages/personality_test/LifestyleResult';
import LifestyleResultList from './pages/personality_test/LifestyleResultList';
import PlantPage from './pages/PlantPage';
import CalendarPage from './pages/CalendarPage';

import BoardPage from './pages/board/BoardPage';

import NBoardCreatePage from './pages/board/NBoardCreatePage';
import BoardReadPage from './pages/board/BoardReadPage';
import BoardUpdatePage from './pages/board/BoardUpdatePage';
import BoardByCategoryPage from './pages/board/BoardByCategoryPage';

import NoticeList from './pages/notice/NoticeList';
import NoticeRead from './pages/notice/NoticeRead';
import NoticeCreate from './pages/notice/NoticeCreate';
import NoticeUpdate from './pages/notice/NoticeUpdate';
import NoticeDelete from './pages/notice/NoticeDelete';

import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';


import PlaylistList from './pages/playlist/PlaylistList';
import PlaylistForm from './pages/playlist/PlaylistForm';
import EmotionForm from './pages/playlist/EmotionForm';
import PlaylistSongList from './pages/playlist/PlaylistSongList';



function App() {
  return (
    <BrowserRouter>
      <h1>토닥</h1>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/todaki" element={<TodakiPage />} />
        <Route path="/personality_test" element={<PersonalityTest />} />
        <Route path="/senior_test" element={<SeniorTest />} /> 
        <Route path="/senior_test/result" element={<SeniorTestResult />} /> 
        <Route path="/mbti" element={<MBTITest />} />
        <Route path="/mbti-result" element={<MBTIResult />} />
        <Route path="/twoweek_test" element={<TwoweekQuestionnaire />} />
        <Route path="/twoweek_test/result" element={<TwoweekResult />} />
        <Route path="/senior_test/testlist/:memberno" element={<SeniorTestList />} />
        <Route path="/twoweek_test/testlist/:memberno" element={<TwoweekResultList />} />
        <Route path="/hobby_test" element={<HobbyTest />} />
        <Route path="/memory_test" element={<MemoryTest />} />
        <Route path="/memory_test/result" element={<MemoryResult />} />
        <Route path="/lifestyle_test" element={<LifestyleTest />} />
        <Route path="/lifestyle_test/result" element={<LifestyleResult />} />
        <Route path="/lifestyle_test/list/:memberno" element={<LifestyleResultList />} />
        <Route path="/plant" element={<PlantPage />} />
        <Route path="/calendar" element={<CalendarPage />} />


        <Route path="/board/list_all" element={<BoardPage />} />
        {/* <Route path="/board/create/:categoryno" element={<BoardCreatePage />} /> */}
        <Route path="/board/create/:categoryno" element={<NBoardCreatePage />} />
        <Route path="/board/read/:boardno" element={<BoardReadPage />} />
        <Route path="/board/update/:boardno" element={<BoardUpdatePage />} />
        <Route path="/board/list_category/:categoryno" element={<BoardByCategoryPage />} />

        <Route path="/board" element={<BoardPage />} />
        <Route path="/notice/list" element={<NoticeList />} />
        <Route path="/notice/read/:noticeno" element={<NoticeRead />} />
        <Route path="/notice/create" element={<NoticeCreate />} />
        <Route path="/notice/update/:noticeno" element={<NoticeUpdate />} />
        <Route path="/notice/delete/:noticeno" element={<NoticeDelete />} />

        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/playlist/list" element={<PlaylistList />} />
        <Route path="/playlist/form" element={<PlaylistForm />} />
        <Route path="/playlist/emotionform" element={<EmotionForm />} />
        <Route path="/playlist_song/list/:playlistno" element={<PlaylistSongList />} />
        
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
