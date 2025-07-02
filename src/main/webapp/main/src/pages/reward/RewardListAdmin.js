import React, { useEffect, useState } from "react";
import axios from "axios";

const RewardListAdmin = () => {
  const [rewards, setRewards] = useState([]);
  const [statusFilter, setStatusFilter] = useState("전체");

  // 보상 목록 불러오기
  const fetchRewards = () => {
    axios.get("/api/reward/list")
      .then((res) => {
        setRewards(res.data);
      })
      .catch(() => {
        alert("보상 목록을 불러오는 데 실패했습니다.");
      });
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  // 상태 변경 처리
  const handleStatusChange = (rewardno) => {
    axios.put("/api/reward/update-status", { rewardno })
      .then(() => {
        alert("상태가 '발송 완료'로 변경되었습니다.");
        fetchRewards();
      })
      .catch(() => {
        alert("상태 변경 실패");
      });
  };

  // 상태 필터링 적용된 보상 목록
  const filteredRewards = rewards.filter((r) =>
    statusFilter === "전체" ? true : r.status === statusFilter
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 보상 신청 관리</h2>

      {/* 상태 필터 드롭다운 */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ marginRight: "10px" }}>상태 필터: </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="전체">전체</option>
          <option value="신청됨">신청됨</option>
          <option value="발송 완료">발송 완료</option>
        </select>
      </div>

      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>번호</th>
            <th>회원번호</th>
            <th>과일</th>
            <th>수령인</th>
            <th>전화번호</th>
            <th>주소</th>
            <th>신청일</th>
            <th>상태</th>
            <th>변경</th>
          </tr>
        </thead>
        <tbody>
          {filteredRewards.length === 0 ? (
            <tr>
              <td colSpan="9" align="center">해당 상태의 보상 신청이 없습니다.</td>
            </tr>
          ) : (
            filteredRewards.map((reward) => (
              <tr key={reward.rewardno}>
                <td>{reward.rewardno}</td>
                <td>{reward.memberno}</td>
                <td>{reward.fruit_type}</td>
                <td>{reward.receiver_name}</td>
                <td>{reward.receiver_phone}</td>
                <td>{reward.address1} {reward.address2}</td>
                <td>{reward.request_date}</td>
                <td>{reward.status}</td>
                <td>
                  {reward.status === "신청됨" ? (
                    <button onClick={() => handleStatusChange(reward.rewardno)}>
                      발송 완료 처리
                    </button>
                  ) : (
                    <span style={{ color: "green" }}>완료</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RewardListAdmin;