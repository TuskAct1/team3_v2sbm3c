// src/components/PointPanel.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PointPanel({ memberno }) {
  const [point, setPoint] = useState(null);
  const [message, setMessage] = useState('');

  // 포인트 조회
  useEffect(() => {
    axios.get(`/api/point/${memberno}`)
      .then(res => setPoint(res.data.amount))
      .catch(err => console.error('포인트 조회 실패', err));
  }, [memberno]);

  // 포인트 차감 테스트 함수
  const deductPoint = (amount) => {
    axios.post(`/api/point/adjust`, { memberno, amount: -amount })
      .then(res => {
        setMessage('포인트 차감 완료!');
        setPoint(prev => prev - amount);
      })
      .catch(err => {
        console.error(err);
        setMessage('포인트 부족!');
      });
  };

  return (
    <div>
      <h3>보유 포인트: {point ?? '로딩 중...'}</h3>
      <button onClick={() => deductPoint(10)}>10포인트 차감</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default PointPanel;
