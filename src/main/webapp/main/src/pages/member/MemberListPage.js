// MemberListPage.js
import React, { useEffect, useState } from 'react';
import '../../styles/MemberListPage.css';

function MemberListPage() {
  const [members, setMembers] = useState([]);

    useEffect(() => {
      fetch("/api/members")
        .then(res => res.json())
        .then(data => {
          console.log("받은 회원 데이터:", data); // 여기서 mdate 값 확인
          if (Array.isArray(data)) {
            setMembers(data);
          } else if (Array.isArray(data.list)) {
            setMembers(data.list);
          } else {
            console.error("데이터 형식이 잘못되었습니다:", data);
            setMembers([]);
          }
        })
        .catch(err => console.error("회원 리스트 불러오기 실패", err));
    }, []);
  const getGradeIcon = (grade) => {
    // 관리자 등급 (1~10): 관리자 아이콘 표시
    if (grade >= 1 && grade <= 10) return "/member/images/admin.png"; 
    
  // 일반 회원 등급 (11~20): 일반 사용자 아이콘 표시
    if (grade >= 11 && grade <= 20) return "/member/images/user.png";
    
  // 활동 정지나 신고?..그런 회원 등급 (30~39): 일시 정지 아이콘 표시
    if (grade >= 30 && grade <= 39) return "/member/images/pause.png";
    
  // 탈퇴한 회원 등급 (40~49): 탈퇴 아이콘 표시
    if (grade >= 40 && grade <= 49) return "/member/images/x.png";

    // 그 외 등급은 아이콘 없음
    return null;
  };

  const handleDelete = (memberno, id) => {
  if (window.confirm(`정말로 회원 ${id} 을(를) 삭제하시겠습니까?`)) {
    fetch(`/api/admin/members/delete?memberno=${memberno}`, {
      method: "DELETE",
    })
      .then(res => {
        if (!res.ok) throw new Error("삭제 실패");
        return res.text();
      })
      .then(result => {
        alert(result);
        // 삭제 후 목록 다시 불러오기
        setMembers(prev => prev.filter(member => member.memberno !== memberno));
      })
      .catch(err => {
        console.error(err);
        alert("삭제 중 오류 발생");
      });
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>회원 리스트 (관리자 전용)</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ width: "5%" }}>구분</th>
            <th style={{ width: "20%" }}>ID</th>
            <th style={{ width: "15%" }}>성명</th>
            <th style={{ width: "15%" }}>전화번호</th>
            <th style={{ width: "25%" }}>주소</th>
            <th style={{ width: "10%" }}>등록일</th>
            <th style={{ width: "10%" }}>관리</th>
          </tr>
        </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.memberno}>
              <td><img src={getGradeIcon(member.grade)} alt="등급" width="20" /></td>
              <td>{member.id}</td>
              <td>{member.mname}</td>
              <td>{member.tel}</td>
              <td>{member.address1?.length > 15 ? member.address1.slice(0, 15) + "..." : member.address1}</td>
              <td>{member.mdate?.slice(0, 10)}</td>
              <td>
                <button onClick={() => alert(`회원 ${member.id} 수정`)}>수정</button>
                <button onClick={() => handleDelete(member.memberno, member.id)}>삭제</button>
              </td>
            </tr>
            ))}
          </tbody>
      </table>
    </div>
  );
}

export default MemberListPage;
