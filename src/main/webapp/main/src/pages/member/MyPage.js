import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MemberEditForm from './MemberEditForm'; // ✅ MemberEditForm으로 수정
import MyRewardList from '../reward/MyRewardList'; // 경로는 실제 위치에 따라 조정


function MyPage() {
  const [userId, setUserId] = useState(null); // 🔹 서버에 보낼 사용자 식별자 (일반은 id, 소셜은 email)
  const [user, setUser] = useState(null);     // 🔹 서버에서 가져온 사용자 정보
  const [editing, setEditing] = useState(false); // 🔹 수정 모드 여부

  // ✅ 로그인된 사용자 정보 로컬스토리지에서 가져오기
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);

        // 🔸 일반 로그인 사용자는 id 사용
        // 🔸 소셜 로그인 사용자는 email 사용
        if (parsed.id) {
          setUserId(parsed.id); // 일반 로그인
        } else if (parsed.email) {
          setUserId(parsed.email); // 소셜 로그인
        } else {
          console.warn("⚠️ 사용자 식별 정보 없음");
        }
      } catch (e) {
        console.error("user 정보 파싱 실패", e);
      }
    }
  }, []);

  // ✅ 사용자 정보 조회 (id or email로 조회)
  useEffect(() => {
    if (!userId) return;

    axios.get(`http://localhost:9093/api/members/id`, {
      params: { id: userId } // 서버에서는 id=email 도 가능하게 처리되어야 함
    })
    .then(res => {
      setUser(res.data); // 🔹 사용자 정보 상태에 저장
    })
    .catch(err => {
      console.error("회원 정보 불러오기 실패", err);
    });
  }, [userId]);

  // ✅ 회원 탈퇴 처리
  const handleDelete = () => {
    if (window.confirm("정말로 탈퇴하시겠습니까?")) {
      axios.delete(`http://localhost:9093/api/members/delete`, {
        params: { memberno: user.memberno } // 🔹 고유 번호로 삭제 요청
      })
      .then(() => {
        alert("탈퇴 완료");
        localStorage.removeItem("user");
        window.location.href = "/";
      })
      .catch(() => {
        alert("탈퇴 실패");
      });
    }
  };

  // ✅ 아직 사용자 정보를 못 불러온 상태라면
  if (!user) return <div>로딩 중...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>사용자 정보</h2>

      {/* ✅ 수정 모드일 경우 수정 폼 렌더링 */}
      {editing ? (
        //  수정 모드일 경우 MemberEditForm 사용
        <MemberEditForm
          initialData={user}
          onCancel={() => setEditing(false)}
          onUpdated={(updatedData) => {
            setUser(updatedData);
            setEditing(false);
            alert("회원 정보가 수정되었습니다.");
          }}
        />
      ) : (
        // ✅ 일반 보기 모드
        <div>
          <p><strong>이메일:</strong> {user.id || user.email}</p>
          <p><strong>이름:</strong> {user.mname}</p>
          <p><strong>닉네임:</strong> {user.nickname}</p>
          <p><strong>전화번호:</strong> {user.tel}</p>
          <p><strong>주소:</strong> {user.address1} {user.address2}</p>
          <p><strong>생년월일:</strong> {user.birthdate}</p>
          <p><strong>성별:</strong> {user.gender}</p>

          {/* 🔸 보호자 정보가 있는 경우 렌더링 */}
          {user.guardians && user.guardians.length > 0 && (
            <div>
              <h4>보호자 정보</h4>
              {user.guardians.map((g, idx) => (
                <div key={idx}>
                  <p>보호자{idx + 1} 이름: {g.name}</p>
                  <p>관계: {g.relationship}</p>
                  <p>이메일: {g.email}</p>
                  <p>전화번호: {g.phone}</p>
                </div>
              ))}
            </div>
          )}

          {/* 🔸 수정 및 탈퇴 버튼 */}
          <button onClick={() => setEditing(true)}>수정</button>
          <button onClick={handleDelete} style={{ marginLeft: "10px" }}>탈퇴</button>
        </div>
      )}
        {/* ✅ 보상 신청 내역 컴포넌트 추가 */}
        <div style={{ marginTop: "40px" }}>
          <h3>보상 신청 내역</h3>
          <MyRewardList memberno={user.memberno} />
        </div>
      </div>
  );
}

export default MyPage;
