// src/pages/member/AdminPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminEditForm from './AdminEditForm'; // 필요 시 따로 생성

function AdminPage() {
  const [adminEmail, setAdminEmail] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const savedAdmin = localStorage.getItem("admin");
    if (savedAdmin) {
      try {
        const parsed = JSON.parse(savedAdmin);
        setAdminEmail(parsed.email); //  관리자 이메일 추출
      } catch (e) {
        console.error("admin 정보 파싱 실패", e);
      }
    }
  }, []);

  // 관리자 정보 불러오기
  useEffect(() => {
    if (!adminEmail) return;

    axios.get(`http://121.78.128.139:9093/api/admin/info`, {
      params: { email: adminEmail }
    })
    .then(res => setAdmin(res.data))
    .catch(err => {
      console.error("관리자 정보 불러오기 실패", err);
    });
  }, [adminEmail]);

  // 관리자 탈퇴
  const handleDelete = () => {
    if (window.confirm("정말로 탈퇴하시겠습니까?")) {
      axios.delete(`http://121.78.128.139:9093/api/admin/delete`, {
        params: { adminno: admin.adminno }
      })
        .then(() => {
          alert("탈퇴 완료");
          localStorage.removeItem("admin");
          window.location.href = "/";
        })
        .catch(() => alert("탈퇴 실패"));
    }
  };

  if (!admin) return <div>로딩 중...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>관리자 정보</h2>

      {editing ? (
        <AdminEditForm
          initialData={admin}
          onCancel={() => setEditing(false)}
          onUpdated={(updatedData) => {
            setAdmin(updatedData);
            setEditing(false);
            alert("관리자 정보가 수정되었습니다.");
          }}
        />
      ) : (
        <div>
          <p><strong>이메일:</strong> {admin.email}</p>
          <p><strong>이름:</strong> {admin.name}</p>

          <button onClick={() => setEditing(true)}>수정</button>
          <button onClick={handleDelete} style={{ marginLeft: "10px" }}>탈퇴</button>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
