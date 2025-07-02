import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminMyPage.css';

function AdminMyPage() {
  const [admin, setAdmin] = useState(null);
  const [currentPasswd, setCurrentPasswd] = useState('');
  const [newPasswd, setNewPasswd] = useState('');
  const [confirmPasswd, setConfirmPasswd] = useState('');
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

  const handleChangePassword = async () => {
    if (!currentPasswd || !newPasswd || !confirmPasswd) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (newPasswd !== confirmPasswd) {
      alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/admin/update-passwd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: admin.email,
          currentPasswd,
          newPasswd
        }),
      });

      if (response.ok) {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        setCurrentPasswd('');
        setNewPasswd('');
        setConfirmPasswd('');
      } else {
        const errorText = await response.text();
        alert("변경 실패: " + errorText);
      }
    } catch (error) {
      alert("서버 오류 발생: " + error.message);
    }
  };

  if (!admin) return null;

  return (
    <div className="admin-mypage-container">
      <h2>👨‍💼 관리자 마이페이지</h2>
      <div className="admin-info-box">
        <p><strong>🆔 아이디:</strong> {admin.id}</p>
        <p><strong>📧 이메일:</strong> {admin.email}</p>
        <p><strong>🔢 관리자 번호:</strong> {admin.adminno}</p>
      </div>

      <h3 style={{ marginTop: "30px" }}>🔐 비밀번호 변경</h3>
      <div className="admin-info-box">
        <div>
          <label>현재 비밀번호:</label>
          <input
            type="password"
            value={currentPasswd}
            onChange={(e) => setCurrentPasswd(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>새 비밀번호:</label>
          <input
            type="password"
            value={newPasswd}
            onChange={(e) => setNewPasswd(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>새 비밀번호 확인:</label>
          <input
            type="password"
            value={confirmPasswd}
            onChange={(e) => setConfirmPasswd(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <button
          onClick={handleChangePassword}
          style={{ marginTop: '10px', backgroundColor: '#2ecc71', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          비밀번호 변경
        </button>
      </div>

      <div className="admin-mypage-buttons">
        <button onClick={() => navigate('/')}>🏠 홈으로 가기</button>
      </div>
    </div>
  );
}

export default AdminMyPage;
