import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredTest, setHoveredTest] = useState(null);
  const [hoveredContent, setHoveredContent] = useState(null);
  const [categoryGroup, setCategoryGroup] = useState([]);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  // 게시판 카테고리 불러오기
  useEffect(() => {
    axios.get('/board/category_group')
      .then(res => setCategoryGroup(res.data))
      .catch(err => console.error("❌ 카테고리 목록 불러오기 실패", err));
  }, []);

  // 로그인 정보 확인
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("유저 정보 파싱 오류", e);
      }
    }
  }, []);

  // 드롭다운 열릴 때 초기 설명 자동 설정
  useEffect(() => {
    if (activeDropdown === 'test') {
      setHoveredTest('personality');
    } else if (activeDropdown === 'content') {
      setHoveredContent('content');
    } else if (activeDropdown === 'todaki') {
      setHoveredTest('chat');
    }
  }, [activeDropdown]);

  const handleLogout = () => {
    const provider = user?.provider;

    // 1️⃣ localStorage 정리
    localStorage.removeItem("user");
    setUser(null);

    // 2️⃣ 네이버 로그아웃 처리
    if (provider === 'naver') {
      // 네이버 로그아웃 전용 팝업
      const logoutPopup = window.open(
        "https://nid.naver.com/nidlogin.logout",
        "_blank",
        "width=500,height=600"
      );

      // 0.5초 후 팝업 닫고 로그인 페이지로 이동
      setTimeout(() => {
        if (logoutPopup && !logoutPopup.closed) {
          logoutPopup.close();
        }
        window.location.href = '/login';

      }, 500); // 약간의 여유 시간 후 이동
    } else {
      window.location.href = '/login';

      }, 500);

      return; // ✅ 아래 코드 실행 안 하게 종료

    }

    // 3️⃣ 나머지 로그인은 그냥 로그인 페이지로 이동
    window.location.href = '/login';
  };

  const isAdmin = user && user.role === 'admin';

  // 드롭다운 제어
  const handleMouseEnterDropdown = (menu) => {
    clearTimeout(timeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeaveDropdown = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  // 페이지 이동 + 드롭다운 닫기
  const handleClickAndClose = (path) => {
    setActiveDropdown(null);
    navigate(path);
  };

  return (
    <nav className="navbar">

      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/playlist/list">🎵 플레이리스트</Link></li>
        <li><Link to="/personality_test">심리테스트</Link></li>
        <li><Link to="/calendar">캘린더</Link></li>
        <li><Link to="/board/list_all/all/1">게시판</Link></li>
        <li><Link to="/notice/list">공지사항</Link></li>
        <li><Link to="/admin/reply-list">신고 리스트</Link></li>

        {user ? (
          <>
            {/* 🔓 로그인한 사용자만 접근 가능한 메뉴 */}
            <li><Link to="/todaki">토닥이</Link></li>
            <li><Link to="/plant">반려식물</Link></li>
            <li><Link to="/diary">일기</Link></li>
            <li><Link to="/emotion_report">감정분석</Link></li>

            <li><Link to="/product">포인트 상점</Link></li>

            <li><Link to="/inquiry">1:1 문의</Link></li>
            <li><Link to="/admin/member-list">회원 리스트</Link></li>

            <li><Link to="/admin/member-list">회원 리스트</Link></li> 
            {/* <li><Link to="/product">포인트 상점</Link></li> */}
            


            {/* 🔐 관리자 전용 메뉴 */}
            {isAdmin && (
              <>

                
                <li><Link to="/admin/">관리 설정</Link></li>
                <li><Link to="/admin/settings">관리 설정</Link></li>

                {/* <li><Link to="/admin/member-list">회원 리스트</Link></li> */}
                {/* <li><Link to="/admin/">관리 설정</Link></li> */}
                {/* <li><Link to="/admin/settings">관리 설정</Link></li> */}

              </>

      <div className="navbar-inner">
        {/* 좌측 로고 */}
        <div className="navbar-left">
          <span
            className="navbar-logo"
            onClick={() => {
              window.scrollTo(0, 0);    // ✅ 맨 위로 스크롤
              navigate('/');            // ✅ 홈으로 이동
            }}
            style={{ cursor: 'pointer' }}  // ✅ 마우스 손가락 모양
          >
            토닥
          </span>
        </div>

        {/* 중앙 메뉴 */}
        <ul className="navbar-center">
          {/* ▼ 토닥이 드롭다운 */}
          <li
            className="dropdown-full"
            onMouseEnter={() => handleMouseEnterDropdown('todaki')}
            onMouseLeave={handleMouseLeaveDropdown}
          >
            <span className="dropbtn" onClick={() => handleClickAndClose('/todaki')}>토닥이</span>
            {activeDropdown === 'todaki' && (
              <div className="dropdown-full-menu">
                <div className="dropdown-columns">
                  <div className="dropdown-left">
                    <span onMouseEnter={() => setHoveredTest('chat')} onClick={() => handleClickAndClose('/todaki')}>토닥이와 대화하기</span>
                    <span onMouseEnter={() => setHoveredTest('info')} onClick={() => handleClickAndClose('/todaki/info')}>토닥이란?</span>
                    <span onMouseEnter={() => setHoveredTest('guide')} onClick={() => handleClickAndClose('/todaki/guide')}>AI 토닥이 사용법</span>
                  </div>
                  <div className="dropdown-right">
                    <div className="content-card">
                      {hoveredTest === 'chat' && (
                        <>
                          <h4>💬 토닥이와 대화하기</h4>
                          <p>
                            마음이 답답할 때, 고민이 있을 때, 또는 그냥 누군가와 이야기하고 싶을 때 <br />
                            <strong>AI 친구 토닥이</strong>가 <strong>언제든지 따뜻하게 들어줄 준비가 되어 있어요</strong>. <br />
                            혼잣말 같지만 혼잣말이 아닌 대화, <strong>감정을 털어놓으며 마음을 가볍게</strong> 해보세요. <br />
                            무뚝뚝하지 않고, <strong>공감과 위로의 말</strong>을 건네는 토닥이와의 대화를 통해 <br />
                            <strong>조용한 마음의 쉼터</strong>를 느낄 수 있을 거예요.
                          </p>
                        </>
                      )}

                      {hoveredTest === 'info' && (
                        <>
                          <h4>💚 토닥이란?</h4>
                          <p>
                            <strong>토닥이</strong>는 감정이 복잡하거나 속상한 날, <strong>당신의 이야기를 들어주는 AI 반려 친구</strong>예요. <br />
                            시니어분들이 <strong>부담 없이 편안하게</strong> 이야기할 수 있도록 <strong>따뜻한 언어와 말투</strong>로 설계되었어요. <br />
                            상담사가 아니더라도, <strong>속마음을 털어놓을 수 있는 누군가</strong>가 필요할 때 <br />
                            토닥이는 언제나 <strong>당신 곁에서 귀 기울여줄 준비가 되어 있습니다</strong>.
                          </p>
                        </>
                      )}

                      {hoveredTest === 'guide' && (
                        <>
                          <h4>📖 사용법 안내</h4>
                          <p>
                            처음 토닥이를 사용하시나요? 걱정하지 마세요. <br />
                            <strong>누구나 쉽게 따라할 수 있도록</strong> 간단하고 친절한 사용법을 준비했어요. <br />
                            대화를 시작하는 방법, 질문을 던지는 방법, 감정 표현하는 방법까지 <br />
                            <strong>한 걸음씩 안내해드릴 테니</strong> 천천히 따라와 주세요. <br />
                            <strong>처음 접하시는 시니어분들도 어렵지 않게</strong> 사용할 수 있도록 도와드립니다.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            )}
          </li>

          {/* ▼ 심리테스트 드롭다운 */}
          <li
            className="dropdown-full"
            onMouseEnter={() => handleMouseEnterDropdown('test')}
            onMouseLeave={handleMouseLeaveDropdown}
          >
            <span className="dropbtn" onClick={() => handleClickAndClose('/personality_test')}>심리테스트</span>
            {activeDropdown === 'test' && (
              <div className="dropdown-full-menu" onMouseEnter={() => handleMouseEnterDropdown('test')} onMouseLeave={handleMouseLeaveDropdown}>
                <div className="dropdown-columns">
                  <div className="dropdown-left">
                    <span onMouseEnter={() => setHoveredTest('personality')} onClick={() => handleClickAndClose('/personality_test')}>전체 심리테스트 보기</span>
                    <span onMouseEnter={() => setHoveredTest('twoweek')} onClick={() => handleClickAndClose('/twoweek_test')}>2주 주기 우울증 자가진단</span>
                    <span onMouseEnter={() => setHoveredTest('senior')} onClick={() => handleClickAndClose('/senior_test')}>노인 우울증 자가진단</span>
                    <span onMouseEnter={() => setHoveredTest('lifestyle')} onClick={() => handleClickAndClose('/lifestyle_test')}>생활 루틴 맞춤 추천</span>
                    <span onMouseEnter={() => setHoveredTest('memory')} onClick={() => handleClickAndClose('/memory_test')}>기억력 자가진단</span>
                    <span onMouseEnter={() => setHoveredTest('mbti')} onClick={() => handleClickAndClose('/mbti')}>MBTI 성격유형 테스트</span>
                    <span onMouseEnter={() => setHoveredTest('hobby')} onClick={() => handleClickAndClose('/hobby_test')}>나에게 어울리는 취미 찾기</span>
                  </div>
                  <div className="dropdown-right">
                    <div className="content-card">
                      {hoveredTest === 'personality' && (
                        <>
                          <h4>🧠 전체 심리테스트 보기</h4>
                          <p>
                            <strong>토닥이에서 제공하는 모든 심리테스트를 한눈에</strong> 살펴볼 수 있어요. <br />
                            우울증 자가진단부터 생활 루틴 추천, 기억력 테스트까지 <strong>마음 건강에 도움이 되는 다양한 검사</strong>가 준비돼 있어요. <br />
                            어떤 테스트가 나에게 맞을지 잘 모르겠다면, <strong>전체 테스트 목록</strong>에서 하나씩 살펴보며 시작해보세요.
                          </p>
                        </>
                      )}

                      {hoveredTest === 'twoweek' && (
                        <>
                          <h4>🗓️ 2주 주기 우울증 자가진단</h4>
                          <p>
                            최근 <strong>2주 동안 느낀 감정과 행동의 변화를 점검</strong>해보는 검사예요. <br />
                            간단한 질문에 답하면서 <strong>현재의 심리 상태</strong>를 스스로 확인할 수 있어요. <br />
                            주기적으로 체크하면 <strong>우울 증상의 변화</strong>를 미리 파악하고 필요한 도움을 받을 수 있습니다.
                          </p>
                        </>
                      )}

                      {hoveredTest === 'senior' && (
                        <>
                          <h4>🧓 노인 우울증 자가진단</h4>
                          <p>
                            <strong>시니어를 위한 맞춤형 심리검사</strong>예요. <br />
                            총 15문항을 통해 <strong>의욕 저하, 피로감, 수면 변화</strong> 등 우울 증상을 체크할 수 있어요. <br />
                            검사 결과를 바탕으로 스스로를 돌아보고, 필요할 땐 <strong>전문가 상담이나 보호자와의 소통</strong>도 추천드려요.
                          </p>
                        </>
                      )}

                      {hoveredTest === 'lifestyle' && (
                        <>
                          <h4>🛋️ 생활 루틴 맞춤 추천</h4>
                          <p>
                            GPT가 <strong>당신의 생활 습관과 성향을 분석</strong>해 나에게 꼭 맞는 <strong>하루 루틴을 제안</strong>해줘요. <br />
                            규칙적인 일상은 <strong>정서 안정과 건강한 생활</strong>에 큰 도움이 됩니다. <br />
                            아침에 일어나서 무엇을 할지, 하루를 어떻게 보낼지 고민된다면 이 테스트로 시작해보세요.
                          </p>
                        </>
                      )}

                      {hoveredTest === 'memory' && (
                        <>
                          <h4>🧠 기억력 자가진단</h4>
                          <p>
                            요즘 자꾸 깜빡깜빡 하시나요? <strong>기억력 상태를 점검하고 인지 능력을 확인할 수 있는</strong> 테스트예요. <br />
                            스스로 현재 기억력이 어떤지 살펴보고, <strong>치매 예방을 위한 첫걸음</strong>으로 활용해보세요. <br />
                            간단한 문항이지만, <strong>자기 상태를 객관적으로 바라보는 데 큰 도움</strong>이 돼요.
                          </p>
                        </>
                      )}

                      {hoveredTest === 'mbti' && (
                        <>
                          <h4>🧩 MBTI 성격유형 테스트</h4>
                          <p>
                            나의 <strong>성격 유형과 행동 스타일</strong>을 재미있게 알아볼 수 있는 검사예요. <br />
                            나 자신을 더 잘 이해하고, 가족이나 친구와의 관계에서도 <strong>서로의 차이를 이해하는 데 도움이 돼요</strong>. <br />
                            검사 결과는 <strong>16가지 성격 유형 중 하나</strong>로 나와요. 재미있게 참여해보세요!
                          </p>
                        </>
                      )}

                      {hoveredTest === 'hobby' && (
                        <>
                          <h4>🎯 나에게 어울리는 취미 찾기</h4>
                          <p>
                            어떤 취미가 나에게 잘 맞을지 고민될 때 <strong>성향 기반으로 맞춤 추천</strong>을 해주는 검사예요. <br />
                            만들기, 음악, 산책, 봉사 등 <strong>다양한 활동 중 나에게 어울리는 취미를 알려줘요</strong>. <br />
                            무료한 일상에 <strong>새로운 즐거움과 활력을 찾아보는 계기</strong>가 될 수 있어요.
                          </p>
                        </>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            )}
          </li>

          {/* ▼ 콘텐츠 드롭다운 */}
          <li
            className="dropdown-full"
            onMouseEnter={() => handleMouseEnterDropdown('content')}
            onMouseLeave={handleMouseLeaveDropdown}
          >
            <span className="dropbtn">콘텐츠</span>
            {activeDropdown === 'content' && (
              <div
                className="dropdown-full-menu"
                onMouseEnter={() => handleMouseEnterDropdown('content')}
                onMouseLeave={handleMouseLeaveDropdown}
              >
                <div className="dropdown-columns">
                  <div className="dropdown-left">
                    <span onMouseEnter={() => setHoveredContent('content')} onClick={() => handleClickAndClose('/content')}>전체 콘텐츠</span>
                    <span onMouseEnter={() => setHoveredContent('plant')} onClick={() => handleClickAndClose('/plant')}>반려식물</span>
                    <span onMouseEnter={() => setHoveredContent('diary')} onClick={() => handleClickAndClose('/diary')}>일기</span>
                    <span onMouseEnter={() => setHoveredContent('emotion')} onClick={() => handleClickAndClose('/emotion_report')}>감정분석</span>
                    <span onMouseEnter={() => setHoveredContent('playlist')} onClick={() => handleClickAndClose('/playlist/list')}>플레이리스트</span>
                    <span onMouseEnter={() => setHoveredContent('calendar')} onClick={() => handleClickAndClose('/calendar')}>캘린더</span>
                  </div>

                  <div className="dropdown-right">
                    <div className="content-card">
                      {hoveredContent === 'content' && (
                        <>
                          <h4>📚 전체 콘텐츠</h4>
                            <p>
                              <strong>토닥</strong>에서는 마음을 돌보고, 일상을 정리하고, 위로받을 수 있는 다양한 콘텐츠들을 제공해요. <br />
                              <strong>감정 분석, 일기, 반려식물, 음악 추천, 캘린더</strong>까지! <br />
                              어떤 기능이 있는지 한눈에 확인할 수 있어 처음 방문한 분들에게 <strong>가장 추천드리는 메뉴</strong>입니다. <br />
                              마음이 지치거나, 어디서부터 시작할지 모를 땐 <strong>전체 콘텐츠</strong>를 천천히 둘러보며 나에게 필요한 기능을 찾아보세요.
                            </p>
                        </>
                      )}

                      {hoveredContent === 'plant' && (
                        <>
                          <h4>🪴 반려식물</h4>
                            <p>
                              반려식물과 함께 시간을 보내는 것만으로도 <strong>마음이 안정되고 우울감이 줄어드는 효과</strong>가 있어요. <br />
                              키우는 식물에게 이름을 지어주고, 매일 바라보는 것만으로도 <strong>정서적인 위안</strong>을 느낄 수 있어요. <br />
                              <strong>반려식물은 말없이 내 곁을 지켜주는 친구</strong>이자, 바쁜 일상 속에서 마음을 쉬게 해주는 존재입니다. <br />
                              자연과 가까워지는 습관을 통해 <strong>마음을 차분하게 다스려보세요</strong>.
                            </p>
                        </>
                      )}

                      {hoveredContent === 'diary' && (
                        <>
                          <h4>📖 일기</h4>
                            <p>
                              하루를 마무리하며 <strong>감정이나 생각을 글로 적는 것</strong>은 마음을 정리하는 데 큰 도움이 돼요. <br />
                              기쁜 일, 속상했던 일, 감사한 일 등 <strong>하루의 순간들을 기록</strong>하며 나를 더 잘 이해해보세요. <br />
                              <strong>매일 조금씩</strong> 적어 나가다 보면, 내 감정의 흐름과 변화도 알 수 있고 <br />
                              시간이 지나 다시 읽어보면 <strong>나에게 큰 위로가 되는 글이 되어줄 거예요</strong>.
                            </p>
                        </>
                      )}

                      {hoveredContent === 'emotion' && (
                        <>
                          <h4>📊 감정분석</h4>
                            <p>
                              내가 쓴 <strong>일기나 채팅 내용</strong>을 AI가 분석해서, <strong>요즘 나의 감정 상태</strong>를 알려줘요. <br />
                              "왜 요즘 이렇게 지치는 걸까?", "내가 자주 느끼는 감정은 뭘까?"라는 질문이 생길 때 <br />
                              <strong>감정분석</strong>은 스스로를 되돌아보는 데 많은 도움이 돼요. <br />
                              AI 분석 결과를 통해 <strong>내 감정의 흐름</strong>을 알 수 있고, 그걸 바탕으로 <strong>심리적인 휴식</strong>을 계획할 수 있어요.
                            </p>
                        </>
                      )}

                      {hoveredContent === 'playlist' && (
                        <>
                          <h4>🎵 플레이리스트</h4>
                            <p>
                              음악은 <strong>말보다 더 큰 위로</strong>가 되어줄 때가 있어요. <br />
                              기분이 가라앉는 날엔 <strong>따뜻한 멜로디</strong>로, 기운이 필요한 날엔 <strong>경쾌한 음악</strong>으로 분위기를 바꿔보세요. <br />
                              감정에 따라 골라 들을 수 있는 음악을 <strong>한 곳에 모아 추천</strong>해드립니다. <br />
                              <strong>노래 한 곡이 위로가 될 수 있다는 것</strong>, 직접 들어보면 느껴질 거예요.
                            </p>
                        </>
                      )}

                      {hoveredContent === 'calendar' && (
                        <>
                          <h4>📅 캘린더</h4>
                            <p>
                              <strong>복지관 행사, 급여일, 봉사 일정, 가족 생일</strong> 등 다양한 일정을 한눈에 정리할 수 있는 기능이에요. <br />
                              일정이 많아도 걱정하지 마세요! <strong>필터 기능</strong>으로 원하는 일정만 골라서 볼 수 있어요. <br />
                              <strong>관리자 일정과 개인 일정이 구분</strong>되어 있어 복지관에서 알려주는 정보와 내 스케줄을 함께 확인할 수 있어요. <br />
                              <strong>+ 버튼을 눌러 직접 일정도 추가</strong>할 수 있어서 아주 편리해요. <br />
                              <strong>월 단위 / 주 단위 보기</strong> 전환도 가능하니, 눈에 편한 방식으로 골라보세요. <br />
                              중요한 약속, 행사, 나만의 일정을 <strong>놓치지 않도록 도와주는 든든한 도우미</strong>입니다.
                            </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </li>

          {/* ▼ 게시판 드롭다운 */}
          <li
            className="dropdown-full"
            onMouseEnter={() => handleMouseEnterDropdown('board')}
            onMouseLeave={handleMouseLeaveDropdown}
          >
            <span className="dropbtn" onClick={() => handleClickAndClose('/board/list_all/all/1')}>게시판</span>
            {activeDropdown === 'board' && (
              <div className="dropdown-full-menu">
                <div className="dropdown-columns">
                  <div className="dropdown-left">
                    <span onClick={() => handleClickAndClose('/board/list_all/all/1')}>전체 게시판</span>
                    {categoryGroup.map((cat) => (
                      <span
                        key={cat.categoryno}
                        onClick={() => handleClickAndClose(`/board/list_category/${cat.categoryno}/all/1`)}
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                  <div className="dropdown-right">
                    <div className="content-card">
                      <h4>📋 게시판 모아보기</h4>
                      <p>
                        토닥의 게시판은 <strong>다양한 주제에 맞춰 나누어진 소통 공간</strong>이에요. <br />
                        <strong>관심 있는 주제</strong>를 골라 다른 분들과 생각을 나누거나, <strong>정보도 공유하고 이야기</strong>할 수 있어요. <br />
                        예를 들어 <strong>복지, 취미, 일상 이야기, 가족 이야기</strong> 등 원하는 주제를 선택해서 구경할 수 있어요. <br />
                        글을 읽기만 해도 좋고, <strong>마음이 가는 이야기에는 댓글이나 글을 남겨보세요</strong>. <br />
                        <strong>소통을 통해 정서적인 교감과 즐거움</strong>을 느낄 수 있는 공간입니다.
                      </p>
                      <Link to="/board/list_all/all/1">→ 전체 게시판 바로가기</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </li>

        </ul>

        {/* 우측 유저 정보 영역 */}
        <ul className="navbar-right">
          {user ? (
            <>
              <li className="user-name">
                <span className="username-text">{user.mname || user.nickname || user.email || user.id}</span>
                <span className="username-suffix">님</span>
              </li>
              <li>
                <Link to={isAdmin ? "/admin/mypage" : "/mypage"} className="nav-user-email">마이페이지</Link>
              </li>
              <li>
                <Link to="/login" onClick={handleLogout} className="nav-user-email">로그아웃</Link>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/signup">회원가입</Link></li>
              <li><Link to="/login">로그인</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
