import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import './Breadcrumb.css';

// ✅ 경로 전체 기준 라벨 매핑 (우선순위 높음)
const fullPathMap = {
  '/twoweek_test': [
    { path: '/personality_test', label: '심리테스트' },
    { path: '/twoweek_test', label: '2주 주기 우울증 자가진단 (PHQ-9)' }
  ],
  '/senior_test': [
    { path: '/personality_test', label: '심리테스트' },
    { path: '/senior_test', label: '노인우울증 검사 (SGDS-K)' }
  ],
  '/lifestyle_test': [
    { path: '/personality_test', label: '심리테스트' },
    { path: '/lifestyle_test', label: '생활 루틴 맞춤 추천' }
  ],
  '/memory_test': [
    { path: '/personality_test', label: '심리테스트' },
    { path: '/memory_test', label: '기억력 자가진단 테스트' }
  ],
  '/mbti': [
    { path: '/personality_test', label: '심리테스트' },
    { path: '/mbti', label: 'MBTI 성격유형 테스트' }
  ],
  '/hobby_test': [
    { path: '/personality_test', label: '심리테스트' },
    { path: '/hobby_test', label: '나에게 어울리는 취미 찾기' }
  ],
  '/plant': [
    { path: '/content', label: '토닥 콘텐츠' },
    { path: '/plant', label: '반려식물' }
  ],
  '/diary': [
    { path: '/content', label: '토닥 콘텐츠' },
    { path: '/diary', label: '일기' }
  ],
  '/calendar': [
    { path: '/content', label: '토닥 콘텐츠' },
    { path: '/calendar', label: '캘린더' }
  ],
  '/emotion_report': [
    { path: '/content', label: '토닥 콘텐츠' },
    { path: '/emotion_report', label: '감정분석' }
  ],
  '/playlist': [
    { path: '/content', label: '토닥 콘텐츠' },
    { path: '/playlist', label: '플레이리스트' }
  ]
};

// ✅ 도란도란 게시판 카테고리 ID → 라벨
const boardCategoryById = {
  4: '고민 게시판',
  5: '자유 게시판',
  6: '건강 게시판',
  7: '금융 게시판',
  8: '생활 게시판'
};

const categoryLabelMap = {
  4: '고민 게시판',
  5: '자유 게시판',
  6: '건강 게시판',
  7: '금융 게시판',
  8: '생활 게시판',
  null: '전체 게시판',
  undefined: '전체 게시판'
};

// ✅ 단일 경로 이름에 대한 라벨
const labelMap = {
  'content': '토닥 콘텐츠',
  'diary': '일기',
  'calendar': '캘린더',
  'emotion_report': '감정분석',
  'playlist': '플레이리스트',
  'plant': '반려식물',
  'todaki': '토닥이',
  'product': '제품',
  'board': '도란도란',
  'mypage': '마이페이지',
  'faq': '자주 묻는 질문',
  'inquiry': '1:1 문의',
  'notice': '공지사항',
  'personality_test': '심리테스트',
  'login' : '로그인',
  'admin_login' : '관리자 로그인',
  'signup' : '회원가입',
  
};

function Breadcrumb({ categoryno }) {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(p => p);
  const fullPath = '/' + paths.join('/');

  // ✅ 전체 경로 기준 라벨 우선
  // ✅ 우선순위: 전체 경로 매핑

  // ✅ 메인 페이지에서는 BreadCrumb 표시 안 함
  if (location.pathname === '/') return null;

  // ✅ 전체 경로 기준 라벨 우선
  if (fullPathMap[fullPath]) {
    const items = fullPathMap[fullPath];


    return (
      <nav className="breadcrumb">
        <Link to="/"><FaHome className="breadcrumb-icon" /></Link>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <span className="separator">›</span>
            {index === items.length - 1 ? (
              <span className="current">{item.label}</span>
            ) : (
              <Link to={item.path}>{item.label}</Link>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }

  

  // ✅ 도란도란 전체 게시판 (/board/list_all/all/1)
  if (location.pathname.startsWith('/board/list_all')) {
    return (
      <nav className="breadcrumb">
        <Link to="/"><FaHome className="breadcrumb-icon" /></Link>
        <span className="separator">›</span>
        <Link to="/board/list_all/all/1" className="breadcrumb-link">도란도란</Link>
        <span className="separator">›</span>
        <span className="current">전체 게시판</span>
        {/* <Link to="/board/list_all/all/1" className="breadcrumb-link">도란도란</Link> */}
      </nav>
    );
  }

  // ✅ 도란도란 카테고리 게시판 (/board/list_category/:categoryId/all/1)
  if (location.pathname.startsWith('/board/list_category')) {
    const parts = location.pathname.split('/');
    const categoryId = parts[3];
    const label = boardCategoryById[categoryId];

    if (label) {
      return (
        <nav className="breadcrumb">
          <Link to="/"><FaHome className="breadcrumb-icon" /></Link>
          <span className="separator">›</span>
          <Link to="/board/list_all/all/1" className="breadcrumb-link">도란도란</Link>
          <span className="separator">›</span>
          <span className="current">{label}</span>
        </nav>
      );
    }
  }

  if (fullPath.startsWith('/board/read')) {
  return (
    <nav className="breadcrumb">
      <Link to="/">
        <FaHome className="breadcrumb-icon" />
      </Link>
      <span className="separator">›</span>
      <Link to="/board/list_all/all/1">도란도란</Link>
      <span className="separator">›</span>
      <span className="current">{categoryLabelMap[categoryno]}</span>
    </nav>
  );
}

  // ✅ 일반 경로 기본 렌더링
  return (
    <nav className="breadcrumb">
      <Link to="/"><FaHome className="breadcrumb-icon" /></Link>
      {paths.map((path, index) => {
        const routeTo = '/' + paths.slice(0, index + 1).join('/');
        const label = labelMap[path] || decodeURIComponent(path);

        return (
          <React.Fragment key={index}>
            <span className="separator">›</span>
            {index === paths.length - 1 ? (
              <span className="current">{label}</span>
            ) : (
              <Link to={routeTo}>{label}</Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
