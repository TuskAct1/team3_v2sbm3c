import React, { useEffect, useState } from 'react';
import axios from 'axios';
import checkIcon from '../../assets/plant/check.png';
import { usePoint } from './PointContext'; // 포인트 컨텍스트에서 fetchPoint 함수 가져오기

const AttendanceButton = () => {
  const memberno = localStorage.getItem('memberno'); // 또는 props로 넘겨도 OK
  const [checked, setChecked] = useState(false);
  const [message, setMessage] = useState('');
  const { fetchPoint } = usePoint(); // 포인트 다시 불러오기

  // ✅ 페이지 진입 시 출석 여부 확인
  useEffect(() => {
    if (memberno) {
      axios.get(`/api/attendance/check?memberno=${memberno}`)
        .then((res) => {
          setChecked(res.data); // true or false
        })
        .catch((err) => {
          console.error('출석 여부 확인 실패', err);
        });
    }
  }, [memberno]);

  // ✅ 출석 버튼 클릭 처리
  const handleCheckAttendance = async () => {
    try {
      const res = await axios.post('/api/attendance/plant/attendance');
      const { status, message } = res.data;

      if (status === 'success') {
        setChecked(true);
        setMessage(message); // 출석 완료 메시지
        await fetchPoint();  // 포인트 새로고침
      } else if (status === 'already') {
        setChecked(true);
        setMessage('이미 출석하셨습니다.');
      } else {
        setMessage('출석 실패: ' + (message || '오류'));
      }
    } catch (err) {
      console.error('출석 요청 실패', err);
      setMessage('출석 처리 중 오류 발생');
    }
  };

  return (
    <div className="action-button attendance">
      <button
        onClick={handleCheckAttendance}
        disabled={checked}
        style={{
          backgroundColor: checked ? '#e0e0e0' : '#f0fff0',
          cursor: checked ? 'not-allowed' : 'pointer',
          padding: '12px',
          borderRadius: '10px',
          textAlign: 'center',
          width: '100px'
        }}
      >
        <img src={checkIcon} alt="출석체크" width={32} height={32} />
        <div style={{ fontSize: 14, marginTop: 6 }}>
          {checked ? '출석완료' : '출석체크'}
        </div>
      </button>
      {message && <p style={{ marginTop: '8px', fontSize: '13px', color: '#555' }}>{message}</p>}
    </div>
  );
};

export default AttendanceButton;
