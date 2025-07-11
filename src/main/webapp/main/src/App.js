import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css";

import Navbar from './components/Navbar';
import MainPage from './pages/MainPage';
import TodakiPage from './pages/chatbot/TodakiPage';

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

import SelfCheckPage from './pages/SelfCheckPage';


import CalendarPage from './pages/calendar/CalendarPage';

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

import SignUpPage from './pages/member/SignUpPage';
import LoginPage from './pages/member/LoginPage';
import SignUpPageAdmin from './pages/member/SignUpPageAdmin';
import LoginPageAdmin from './pages/member/LoginPageAdmin';
import MemberListPage from './pages/member/MemberListPage';

import AdminPage from './pages/member/AdminPage';
import MyPage from './pages/member/MyPage';
import DiaryPage from './pages/diary/DiaryPage';
import AdminMyPage from './pages/member/AdminMyPage';
import PlantPage from './pages/plant/PlantPage';
import ProductPage from './pages/product/ProductPage';

import PlaylistList from './pages/playlist/PlaylistList';
import PlaylistForm from './pages/playlist/PlaylistForm';
import EmotionForm from './pages/playlist/EmotionForm';
import PlaylistSongList from './pages/playlist/PlaylistSongList';

import PlantHomePage from './pages/plant/PlantHomePage'; // 또는 실제 사용하는 쪽만 남기세요
import MemoryGame from './pages/plant/games/MemoryGame';
import PlantMain from './pages/plant/PlantMain';
import GameSelect from './pages/plant/games/GameSelect';
import PlantCreatePage from './pages/plant/PlantCreatePage'; // 존재하는 경우
import PlantIntro from './pages/plant/PlantIntro'; 
import ReplyReportListPage from './pages/reply/ReplyReportListPage';
import EmotionReportPage from './pages/emotion_report/EmotionReportPage';
import DiaryCreate from './pages/diary/DiaryCreate';
import DiaryUpdate from './pages/diary/DiaryUpdate';
import DiaryRead from './pages/diary/DiaryRead';


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
        <Route path="/senior_test/testlist" element={<SeniorTestList />} />
        <Route path="/twoweek_test/testlist" element={<TwoweekResultList />} />
        <Route path="/hobby_test" element={<HobbyTest />} />
        <Route path="/memory_test" element={<MemoryTest />} />
        <Route path="/memory_test/result" element={<MemoryResult />} />
        <Route path="/lifestyle_test" element={<LifestyleTest />} />
        <Route path="/lifestyle_test/result" element={<LifestyleResult />} />
        <Route path="/lifestyle_test/list" element={<LifestyleResultList />} />
        <Route path="/calendar" element={<CalendarPage />} />

        <Route path="/emotion_report" element={<EmotionReportPage />} />

        <Route path="/self-check" element={<SelfCheckPage />} />


        <Route path="/board/list_all/:word/:now_page" element={<BoardPage />} />
        <Route path="/board/create/:categoryno" element={<NBoardCreatePage />} />
        <Route path="/board/read/:boardno" element={<BoardReadPage />} />
        <Route path="/board/update/:boardno" element={<BoardUpdatePage />} />
        <Route path="/board/list_category/:categoryno/:word/:now_page" element={<BoardByCategoryPage />} />

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
          
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin_login" element={<LoginPageAdmin />} />
        <Route path="/admin_signup" element={<SignUpPageAdmin  />} />
        <Route path="/admin/member-list" element={<MemberListPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/admin/mypage" element={<AdminMyPage />} />
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/login" element={<LoginPage />} />
        {/* ✅ 반려식물 기능은 PlantProvider로 감싸줌 */}
        {/* <Route path="/plant" element={<PlantProvider><PlantPage /></PlantProvider>}/> */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}

        <Route path="/diary" element={<DiaryPage/>} />
        <Route path="/diary/create" element={<DiaryCreate/>} />
        <Route path="/diary/update/:id" element={<DiaryUpdate/>} />
        <Route path="/diary/read/:id" element={<DiaryRead/>} />

        <Route path="/product" element={<ProductPage/>} />

          {/* plant 관련 설정 */}
          <Route path="/plant/intro" element={<PlantIntro />} />  {/* ⬅️ Intro 라우트 추가 */}
          <Route path="/plant/create" element={<PlantCreatePage />} />
          <Route path="/plant" element={<PlantPage />} />
          <Route path="/plant/game" element={<GameSelect />} />


        <Route path='/admin/reply-list' element={<ReplyReportListPage />} />

      </Routes>


    </BrowserRouter>
  );
}

export default App;
