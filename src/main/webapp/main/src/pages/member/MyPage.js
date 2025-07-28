import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyPage.css';
import { FaCheckCircle, FaCamera, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import MyInquiryList from './MyInquiryList';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight } from 'react-icons/fa'; // ⬅️ 아이콘 추가
import { useNavigate } from 'react-router-dom'; // ⬅️ useNavigate 추가
import EditProfileForm from './EditProfileForm'; // 추가


function MyPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [isMorning, setIsMorning] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [previousTab, setPreviousTab] = useState("home");
  const [completedScheduleMap, setCompletedScheduleMap] = useState({});
  

  // ✅ 로컬스토리지에서 불러오기
  useEffect(() => {
    const storedMap = localStorage.getItem("completedScheduleMap");
    if (storedMap) {
      setCompletedScheduleMap(JSON.parse(storedMap));
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUserId(parsed.id || parsed.email || null);
      } catch (e) {
        console.error("user 정보 파싱 실패", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    axios.get("/api/members/id", { params: { id: userId } })
      .then(res => {
        setUser(res.data);
        fetchRewards(res.data.memberno);
        fetchSchedules(res.data.memberno);
      })
      .catch(err => console.error("회원 정보 불러오기 실패", err));
  }, [userId]);

  const fetchRewards = (memberno) => {
    axios.get("/api/rewards", { params: { memberno } })
      .then(res => setRewards(res.data))
      .catch(err => console.error("보상 정보 불러오기 실패", err));
  };

  // const fetchSchedules = (memberno) => {
  //   if (!memberno) return;
  //   axios.get(`/calendar/list_all?memberno=${memberno}`, { withCredentials: true })
  //     .then(res => setSchedules(res.data))
  //     .catch(err => console.error("일정 불러오기 실패", err));
  // };


  const handleProfileUpload = (file) => {
    if (!file || !user) return;
    const formData = new FormData();
    formData.append("memberno", user.memberno);
    formData.append("profileFile", file);

    axios.post("/api/members/update-profile", formData)
      .then(() => {
        alert("프로필 이미지가 변경되었습니다.");
        axios.get(`/api/members/${user.memberno}`).then(res => setUser(res.data));
      })
      .catch(err => {
        alert("업로드 실패");
        console.error(err);
      });
  };

  const handleTabChange = (newTab) => {
    if (newTab !== activeTab) {
      setPreviousTab(activeTab);
      setActiveTab(newTab);
    }
  };

  // const filteredSchedules = schedules; // 지금은 모든 일정 표시
  const filteredSchedules = schedules.filter((s) => {
  const hour = parseInt(s.start_time?.split(':')[0], 10);
  return isMorning ? hour < 12 : hour >= 12;
});

  const handleToggleComplete = (calendarno) => {
    const idStr = String(calendarno);
    setCompletedScheduleMap(prev => {
      const updated = {
        ...prev,
        [idStr]: !prev[idStr],
      };
      localStorage.setItem("completedScheduleMap", JSON.stringify(updated));
      return updated;
    });
  };
  const fetchSchedules = (memberno) => {
  if (!memberno) return;
  axios.get(`/calendar/list_all?memberno=${memberno}`)
    .then(res => {
      console.log("📅 일정 데이터:", res.data); // ✅ 여기에 로그 추가
      setSchedules(res.data);
    })
    .catch(err => console.error("일정 불러오기 실패", err));
};

  if (!user) return <div>로딩 중...</div>;

  return (
    
    <div className="mypage-container">
      <div className="mypage-wrapper">
        {/* ✅ 상단: 프로필 + 탭 영역 (흰색 배경) */}
        <div className="mypage-header-section">
          <div className="profile-box">
            <div className="profile-img-wrapper">
              <img
                className="profile-img"
                src={`/profile/${user.profile}`}
                alt="프로필"
                onError={(e) => (e.target.src = "/profile/default_profile.png")}
              />
            </div>
            <div className="profile-name">
              {user.mname} 님 <span className="profile-nickname">({user.nickname})</span>
            </div>
          </div>

          <div className="mypage-tabs-wrapper">
            {["home", "inquiry", "info", "settings"].map((tab) => (
              <div
                key={tab}
                className={`mypage-tab-item ${activeTab === tab ? "active" : ""}`}
                onClick={() => handleTabChange(tab)}
              >
                {{
                  home: "홈",
                  inquiry: "문의내역",
                  info: "내정보",
                  settings: "설정"
                }[tab]}
              </div>
            ))}
          </div>
        </div>

        {/* ✅ 하단: 콘텐츠 영역 (연두색 배경) */}
        <div className="mypage-content-section">
          <div className="mypage-tab-content-wrapper">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="mypage-tab-motion-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                {activeTab === "home" && (
                  <>
                    {/* 하루 일정 */}
                    <div className="mypage-schedule-section">
                      <div className="mypage-schedule-header-row">
                        <div className="mypage-schedule-title-wrapper" onClick={() => navigate('/calendar')}>
                          <h3 className="mypage-schedule-title">하루 일정</h3>
                          <FaChevronRight className="mypage-schedule-more-arrow" />
                        </div>

                        <div className="toggle-switch">
                          <div className={`switch ${isMorning ? 'morning' : 'afternoon'}`}>
                            <button onClick={() => setIsMorning(true)} className={isMorning ? 'active' : ''}>오전</button>
                            <button onClick={() => setIsMorning(false)} className={!isMorning ? 'active' : ''}>오후</button>
                          </div>
                        </div>
                      </div>

                      {filteredSchedules.length === 0 ? (
                        <div className="mypage-schedule-empty-box">
                          <div className="emoji">📭</div>
                          <div className="text-bold">등록된 일정이 없습니다</div>
                          <div className="text-sub">캘린더에서 일정을 추가해보세요.</div>
                        </div>
                      ) : (
                        <div className="mypage-schedule-list">
                          {filteredSchedules.map((item) => {
                            const idStr = String(item.calendarno);
                            const isCompleted = completedScheduleMap[idStr] === true;

                            return (
                              <div key={item.calendarno} className="mypage-schedule-card">
                                <div className="mypage-schedule-info">
                                  <p className={`schedule-card-title ${isCompleted ? 'completed' : ''}`}>{item.title}</p>
                                  <p className="schedule-card-desc">{item.category || '일정'} | {item.start_time || '시간 없음'}</p>
                                </div>
                                <div className="check-icon-wrapper">
                                  <FaCheckCircle
                                    className={`schedule-check-icon ${isCompleted ? 'completed' : 'not-completed'}`}
                                    onClick={() => handleToggleComplete(item.calendarno)}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* 보상 신청 내역 */}
                    <div className="mypage-reward-section">
                      <div className="mypage-reward-header" onClick={() => navigate('/rewards')} style={{ cursor: 'pointer' }}>
                        <div className="mypage-reward-title">보상 신청 내역</div>
                        <FaChevronRight className="mypage-reward-arrow" />
                      </div>

                      {rewards.length === 0 ? (
                        <div className="mypage-reward-empty-box">
                          <div className="emoji">🥹</div>
                          <div className="text-bold">신청된 보상이 없습니다</div>
                          <div className="text-sub">스티커 10개를 다 모아 보상을 신청해보세요.</div>
                          <Link to="/plant" className="mypage-reward-button">반려식물 키우러 가기</Link>
                        </div>
                      ) : (
                        <div className="mypage-reward-list">
                          {rewards.map((reward) => (
                            <div key={reward.reward_id || `${reward.itemName}-${reward.status}`} className="mypage-reward-item">
                              <p>{reward.itemName} ({reward.status})</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                 </>
              )}
              {activeTab === "inquiry" && <MyInquiryList memberno={user.memberno} />}
              {activeTab === "info" && <EditProfileForm user={user} />}
              {/* {activeTab === "info" && <div>내정보 탭 내용</div>} */}
              {activeTab === "settings" && <div>설정 탭 내용</div>}
            </motion.div>
          </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );

}

export default MyPage;
