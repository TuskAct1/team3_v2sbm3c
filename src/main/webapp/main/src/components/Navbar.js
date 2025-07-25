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
                    <span onMouseEnter={() => setHoveredTest('info')}>토닥이란?</span>
                    <span onMouseEnter={() => setHoveredTest('guide')}>AI 토닥이 사용법</span>
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
                              ① 상단의 <strong>토닥이</strong>를 눌러 대화를 시작하세요.<br />
                              ② 하고 싶은 말을 편하게 입력해보세요. <br />
                              ③ 토닥이는 여러분의 말을 <strong>감정 분석</strong>하여 따뜻하게 반응해줍니다.<br />
                              ④ 마음이 편해질 때까지 <strong>계속 이야기 나눠보세요</strong>.
                            </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </li>

          {/* ▼ 자가진단 드롭다운 */}
          <li
            className="dropdown-full"
              onMouseEnter={() => {
                handleMouseEnterDropdown('checkup');
                setHoveredTest('all'); // ✅ 드롭다운 열릴 때 '전체 자가진단 보기'가 기본 설명으로!
              }}
            onMouseLeave={handleMouseLeaveDropdown}
          >
            <span className="dropbtn" onClick={() => handleClickAndClose('/personality_test')}>자가진단</span>
            {activeDropdown === 'checkup' && (
              <div className="dropdown-full-menu" onMouseEnter={() => handleMouseEnterDropdown('checkup')} onMouseLeave={handleMouseLeaveDropdown}>
                <div className="dropdown-columns">
                  {/* 왼쪽: 항목 목록 */}
                  <div className="dropdown-left">
                    <span onMouseEnter={() => setHoveredTest('all')} onClick={() => handleClickAndClose('/personality_test')}>자가진단 모아보기</span>
                    <span onMouseEnter={() => setHoveredTest('twoweek')} onClick={() => handleClickAndClose('/twoweek_test')}>2주 우울감 점검</span>
                    <span onMouseEnter={() => setHoveredTest('senior')} onClick={() => handleClickAndClose('/senior_test')}>노인 우울 자가진단</span>
                    <span onMouseEnter={() => setHoveredTest('lifestyle')} onClick={() => handleClickAndClose('/lifestyle_test')}>생활 루틴 진단</span>                    
                    <span onMouseEnter={() => setHoveredTest('memory')} onClick={() => handleClickAndClose('/memory_test')}>기억력 체크</span>
                    <span onMouseEnter={() => setHoveredTest('hobby')} onClick={() => handleClickAndClose('/hobby_test')}>나에게 맞는 취미</span>
                    <span onMouseEnter={() => setHoveredTest('mbti')} onClick={() => handleClickAndClose('/mbti')}>MBTI 성향 알아보기</span>
                  </div>

                  {/* 오른쪽: 설명 카드 */}
                  <div className="dropdown-right">
                    <div className="content-card">
                      {hoveredTest === 'all' && (
                        <>
                          <h4>📋 자가진단 모아보기</h4>
                            <p>
                              마음 건강이든 생활 습관이든, 나를 돌보는 일은 아주 소중해요. <br />
                              토닥이에서는 <strong>우울감, 생활 습관, 기억력, 성향</strong> 등을 점검할 수 있는 다양한 자가진단을 제공해요. <br />
                              특별한 준비 없이도 간단한 체크만으로 지금의 내 상태를 알아볼 수 있어요. <br /><br />
                              내 기분과 마음을 조심스럽게 들여다보며, 나에게 꼭 맞는 돌봄의 방법을 함께 찾아가요.
                            </p>
                        </>
                      )}

                      {hoveredTest === 'twoweek' && (
                        <>
                          <h4>🗓️ 2주 우울감 점검</h4>
                          <p>
                            최근 2주 동안의 나의 기분과 행동을 되돌아보며 <strong>현재 심리 상태를 확인</strong>하는 간단한 검사예요. <br />
                            ‘잠을 잘 못 잤던가?’, ‘무기력했는가?’, ‘슬픈 감정을 자주 느꼈는가?’ 같은 질문에 솔직하게 답하면서, <br />
                            <strong>우울감의 신호를 조기에 발견</strong>할 수 있도록 도와줘요. <br />
                            특히 혼자 감정을 정리하기 어려울 때, 이 검사로 나 자신을 바라보는 시간을 가져보세요.
                          </p>
                        </>
                      )}

                      {hoveredTest === 'senior' && (
                        <>
                          <h4>🧓 노인 우울 자가진단</h4>
                          <p>
                            노년기에는 신체 변화나 사회적 외로움으로 인해 <strong>마음이 울적해지는 경우</strong>가 많아요. <br />
                            이 검사는 <strong>의욕 감소, 피로, 식욕 변화, 외로움</strong> 등 시니어분들이 겪을 수 있는 감정들을 정리해보며 <br />
                            <strong>현재의 정서적 상태를 부드럽게 점검</strong>해보도록 구성되어 있어요. <br />
                            스스로 상태를 돌아보고, 필요하다면 <strong>가족이나 전문가와 소통할 계기</strong>로도 이어질 수 있어요.
                          </p>
                        </>
                      )}

                      {hoveredTest === 'lifestyle' && (
                        <>
                          <h4>🛋️ 생활 루틴 진단</h4>
                          <p>
                            하루하루가 비슷하게 지나가는 것 같을 때, <strong>나만의 규칙적인 루틴</strong>을 찾는 것이 도움이 돼요. <br />
                            이 검사는 <strong>현재 나의 생활 습관을 분석하고</strong>, 보다 건강하고 활기찬 하루를 만들 수 있도록 <strong>GPT가 맞춤 루틴을 제안</strong>해줘요. <br />
                            아침 기상부터 식사, 운동, 여가 활동까지 <strong>나에게 꼭 맞는 하루</strong>를 함께 설계해보세요.
                          </p>
                        </>
                      )}

                      {hoveredTest === 'memory' && (
                        <>
                          <h4>🧠 기억력 체크</h4>
                          <p>
                            “어디 뒀더라?” “방금 뭐 하려고 했지?” 같은 순간이 잦아졌다면, <strong>기억력 점검</strong>이 필요할 수 있어요. <br />
                            이 검사는 일상 속 기억력 저하의 징후를 체크하여 <strong>인지 건강 상태를 가볍게 살펴보는 도구</strong>예요. <br />
                            <strong>치매를 미리 예방하고, 평소 생활에서 주의해야 할 점</strong>도 함께 알려드려요. <br />
                            간단하지만 꼭 필요한 검사입니다.
                          </p>
                        </>
                      )}

                      {hoveredTest === 'hobby' && (
                        <>
                          <h4>🎯 나에게 맞는 취미</h4>
                          <p>
                            "나도 뭔가 재미있는 걸 해보고 싶은데…" 고민 중이라면 이 검사를 추천해요! <br />
                            나의 성향과 활동 스타일에 맞춰 <strong>산책, 그림 그리기, 음악 감상, 자원봉사</strong> 등 <br />
                            <strong>다양한 취미 활동을 제안</strong>해드려요. <br />
                            새로운 취미는 <strong>마음의 활력을 불어넣고, 하루의 즐거움</strong>이 될 수 있어요.
                          </p>
                        </>
                      )}

                      {hoveredTest === 'mbti' && (
                        <>
                          <h4>🧩 MBTI 성향 알아보기</h4>
                          <p>
                            나의 <strong>성격 유형과 사람들과의 관계에서 어떤 모습을 보이는지</strong> 알 수 있는 검사예요. <br />
                            총 16가지 유형 중 내가 속한 성향을 통해, <strong>나 자신을 더 잘 이해하고</strong>, <br />
                            가족, 친구, 이웃과의 관계에서도 <strong>서로 다름을 존중하며 소통</strong>할 수 있어요. <br />
                            재밌으면서도 생각할 거리도 많은 테스트랍니다.
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
            <span className="dropbtn" onClick={() => handleClickAndClose('/content')}>콘텐츠</span>
            {activeDropdown === 'content' && (
              <div
                className="dropdown-full-menu"
                onMouseEnter={() => handleMouseEnterDropdown('content') }
                onMouseLeave={handleMouseLeaveDropdown}
              >
                <div className="dropdown-columns">
                  <div className="dropdown-left">
                    <span onMouseEnter={() => setHoveredContent('content')} onClick={() => handleClickAndClose('/content')}>콘텐츠 모아보기</span>
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
                          <h4>📚 콘텐츠 모아보기</h4>
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
                              <strong>관리자 일정과 개인 일정이 구분</strong>되어 있어 복지 정보와 내 스케줄을 함께 확인할 수 있어요. <br />
                              <strong>월 단위 / 주 단위 보기</strong> 전환도 가능하니, 눈에 편한 방식으로 골라보세요. 
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
            <span className="dropbtn" onClick={() => handleClickAndClose('/board/list_all/all/1')}>도란도란</span>
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
                      <h4>💬 게시판 모아보기</h4>
                      <p>
                        도란도란은 <strong>다양한 주제에 맞춰 나누어진 소통 공간</strong>이에요. <br />
                        <strong>관심 있는 주제</strong>를 골라 다른 분들과 생각을 나누거나, <strong>정보도 공유하고 이야기</strong>할 수 있어요. <br />
                        예를 들어 <strong>복지, 취미, 일상 이야기, 가족 이야기</strong> 등 원하는 주제를 선택해서 구경할 수 있어요. <br />
                        글을 읽기만 해도 좋고, <strong>마음이 가는 이야기에는 댓글이나 글을 남겨보세요</strong>. <br />
                        <strong>소통을 통해 정서적인 교감과 즐거움</strong>을 느낄 수 있는 공간입니다.
                      </p>
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
