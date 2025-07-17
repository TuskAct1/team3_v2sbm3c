import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminMyPage.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCog, FaUsers, FaExclamationTriangle, FaHome } from 'react-icons/fa';
import MemberListPage from './MemberListPage'; // 경로는 실제 구조에 따라 조정
import ReplyReportListPage from '../reply/ReplyReportListPage';
import AdminEditForm from './AdminEditForm';

function AdminMyPage() {
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('members');
  const [previousTab, setPreviousTab] = useState('members');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role === "admin") {
          setAdmin(parsed);
        } else {
          alert("접근 권한이 없습니다.");
          navigate("/login");
        }
      } catch (err) {
        console.error("❌ 관리자 정보 파싱 오류", err);
        navigate("/login");
      }
    } else {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [navigate]);

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setPreviousTab(activeTab);
      setActiveTab(tab);
    }
  };

  if (!admin) return null;

  return (
    <div className="admin-mypage-container">
      <div className="breadcrumb">
        <FaHome className="home-icon" />
        <span>&nbsp;&gt;&nbsp;</span>
        <span>관리자 마이페이지</span>
      </div>
      <div className="breadcrumb-line"></div>

      <div className="admin-profile-box">
        <div className="admin-name">{admin.id} 관리자님</div>
      </div>

      <div className="tabs-wrapper">
        {[
          { key: 'members', label: '회원 리스트', icon: <FaUsers /> },
          { key: 'reports', label: '신고 리스트', icon: <FaExclamationTriangle /> },
          { key: 'info', label: '관리자 정보', icon: <FaUserCog /> },
        ].map(({ key, label, icon }) => (
          <div
            key={key}
            className={`tab-item ${activeTab === key ? 'active' : ''}`}
            onClick={() => handleTabChange(key)}
          >
            {icon} {label}
          </div>
        ))}
      </div>

      <div className="tab-content-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="tab-motion-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
          {activeTab === "members" && (
            <div className="tab-motion-content"><MemberListPage /></div>
          )}

          {activeTab === "reports" && (
            <div className="tab-motion-content"><ReplyReportListPage /></div>
          )}

          {activeTab === "info" && (
            <div className="tab-motion-content">
              <AdminEditForm admin={admin} />
            </div>
          )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AdminMyPage;
