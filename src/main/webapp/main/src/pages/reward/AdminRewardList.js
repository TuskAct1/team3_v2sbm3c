import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminRewardList = () => {
  const [list, setList] = useState([]);

  const fetchList = () => {
    axios.get("/api/reward/list/all").then((res) => setList(res.data));
  };

  const updateStatus = (requestno, status) => {
    axios.put("/api/reward/status", { requestno, status }).then((res) => {
      if (res.data.success) {
        alert("상태 변경 성공");
        fetchList();
      }
    });
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div>
      <h2>전체 보상 신청 목록</h2>
      <table border="1">
        <thead>
          <tr>
            <th>신청번호</th>
            <th>회원번호</th>
            <th>과일</th>
            <th>이름</th>
            <th>주소</th>
            <th>상태</th>
            <th>변경</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item.requestno}>
              <td>{item.requestno}</td>
              <td>{item.memberno}</td>
              <td>{item.fruit_type}</td>
              <td>{item.receiver_name}</td>
              <td>{item.address1} {item.address2}</td>
              <td>{item.status}</td>
              <td>
                <select
                  value={item.status}
                  onChange={(e) => updateStatus(item.requestno, e.target.value)}
                >
                  <option value="신청 완료">신청 완료</option>
                  <option value="배송 준비중">배송 준비중</option>
                  <option value="배송 완료">배송 완료</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRewardList;
