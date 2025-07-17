import React from 'react';
import './CategoryGroupBar.css'; // ✅ 스타일 따로 분리

function CategoryGroupBar({ categoryGroup, selected, onChange }) {
  return (
    <div className="category-bar">
      <button
        key="all"
        onClick={() => onChange('all')}
        className={`category-btn ${selected === 'all' ? 'active' : ''}`}
      >
        전체
      </button>

      {categoryGroup.map(categoryVO => (
        <button
          key={categoryVO.categoryno}
          onClick={() => onChange(String(categoryVO.categoryno))}
          className={`category-btn ${selected === String(categoryVO.categoryno) ? 'active' : ''}`}
        >
          {categoryVO.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryGroupBar;
