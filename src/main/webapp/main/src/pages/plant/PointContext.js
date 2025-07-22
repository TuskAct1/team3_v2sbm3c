import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const PointContext = createContext();
export const PointProvider = ({ children, memberno }) => {
  const [point, setPoint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (memberno) {
      axios.get(`/api/point/${memberno}`)
        .then(res => {
          setPoint(res.data.point);
          setLoading(false);
        })
        .catch(err => {
          console.error("포인트 불러오기 실패", err);
          setLoading(false);
        });
    }
  }, [memberno]);

  const updatePoint = (delta) => {
    if (!memberno) return;
    axios.post('/api/point/adjust', { memberno, delta })
      .then(() => setPoint(prev => prev + delta))
      .catch(err => console.error("포인트 업데이트 실패", err));
  };
  

  return (
    <PointContext.Provider value={{ point, updatePoint, setPoint }}>
      {children}
    </PointContext.Provider>
  );
  
};

export const usePoint = () => {
  const context = useContext(PointContext);
  if (!context) {
    throw new Error('usePoint must be used within a PointProvider');
  }
  return context;
};