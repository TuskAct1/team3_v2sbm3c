// src/pages/plant/ShopPanel.js
import React from 'react';
import axios from 'axios';

const ShopPanel = ({ memberno, onPurchase }) => {
  const items = [
    { name: '영양제', cost: 10, code: 'nutrient' },
    { name: '물', cost: 5, code: 'water' },
    { name: '비료', cost: 15, code: 'fertilizer' },
  ];

  const handleBuy = async (item) => {
    const res = await axios.post('/api/point/decrease', null, {
      params: { memberno, amount: item.cost },
    });

    alert(`${item.name} 사용!`);
    onPurchase(item.code); // 성장 처리
  };

  return (
    <div style={{ border: '1px solid gray', padding: 10 }}>
      <h4>🌱 상점</h4>
      {items.map(item => (
        <button key={item.code} onClick={() => handleBuy(item)} style={{ marginRight: 8 }}>
          {item.name} (-{item.cost}P)
        </button>
      ))}
    </div>
  );
};

export default ShopPanel;
