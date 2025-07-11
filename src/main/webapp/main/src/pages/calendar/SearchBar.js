// src/components/SearchBar.js
import React from 'react';

function SearchBar({ keyword, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 1rem' }}>
      <h2>일정 캘린더</h2>
      <input
        type="text"
        placeholder="제목 검색"
        value={keyword}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '6px 10px',
          fontSize: '14px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          width: '200px'
        }}
      />
    </div>
  );
}

export default SearchBar;
