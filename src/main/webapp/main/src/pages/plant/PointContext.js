import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';


// 🎯 포인트 Context 생성
export const PointContext = createContext();

// 🎯 Context Provider
export const PointProvider = ({ children, memberno }) => {
  const [point, setPoint] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ 처음 마운트될 때 포인트 불러오기
  useEffect(() => {
    if (memberno) {
      axios.get(`/api/point/${memberno}`)
        .then(res => {
          setPoint(res.data.amount); // ✅ amount로 응답받음 (백엔드 확인 필요)
          setLoading(false);
        })
        .catch(err => {
          console.error("❌ 포인트 불러오기 실패", err);
          setLoading(false);
        });
    }
  }, [memberno]);

  // ✅ 포인트 변화 함수 (즉시 반영)
  const updatePoint = (delta) => {
    if (!memberno) return;

    axios.post('/api/point/adjust', {
      memberno,
      pointChange: delta
    })
      .then(() => {
        setPoint(prev => Math.max(0, prev + delta)); // ✅ 즉시 UI 반영
      })
      .catch(err => {
        console.error("❌ 포인트 업데이트 실패", err);
      });
  };

  return (
    <PointContext.Provider value={{ point, updatePoint, setPoint }}>
      {children}
    </PointContext.Provider>
  );
};

// 🎯 외부에서 포인트 정보 사용
export const usePoint = () => {
  const context = useContext(PointContext);
  if (!context) {
    throw new Error('usePoint must be used within a PointProvider');
  }
  return context;
};
