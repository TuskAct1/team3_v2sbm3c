import React from 'react';
import useItem from './useItem';

const ItemButtons = ({ plantno, memberno, fetchGrowth }) => {
  const { useItemEffect } = useItem(memberno, plantno, fetchGrowth);

  return (
    <div className="item-buttons">
      <button onClick={() => useItemEffect('영양제')}>영양제 주기</button>
      <button onClick={() => useItemEffect('물')}>물 주기</button>
      <button onClick={() => useItemEffect('비료')}>비료 주기</button>
    </div>
  );
};

export default ItemButtons;
