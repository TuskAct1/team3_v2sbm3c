import React, { useEffect, useState } from "react";
import axios from "axios";

const MyRewardList = ({ memberno }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!memberno) return;

    axios
      .get(`http://121.78.128.139:9093/api/reward/list/member?memberno=${memberno}`)
      .then((res) => setList(res.data))
      .catch((err) => console.error(err));
  }, [memberno]);

  return (
    <div>
      <h2>내 보상 신청 내역</h2>
      {list.length === 0 ? (
        <p>신청한 보상이 없습니다.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>신청 번호</th>
              <th>과일</th>
              <th>수령인</th>
              <th>주소</th>
              <th>전화번호</th>
              <th>신청일</th>
              <th>배송 상태</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.requestno}>
                <td>{item.requestno}</td>
                <td>{item.fruit_type}</td>
                <td>{item.receiver_name}</td>
                <td>{item.address1} {item.address2} ({item.zipcode})</td>
                <td>{item.receiver_phone}</td>
                <td>{item.request_date?.substring(0, 10)}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyRewardList;
