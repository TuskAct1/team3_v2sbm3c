// src/components/SearchToggleBar.js
import React from 'react';
import { FaSearch } from 'react-icons/fa';

function SearchToggleBar({ showSearch, onToggle, keyword, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '0.5rem 1rem' }}>
      {!showSearch ? (
        <button onClick={onToggle} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <FaSearch size={18} />
        </button>
      ) : (
        <>
          <input
            type="text"
            placeholder="제목 검색"
            value={keyword}
            onChange={(e) => onChange(e.target.value)}
            autoFocus
            style={{
              padding: '6px 10px',
              fontSize: '14px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '200px',
              marginRight: '8px'
            }}
          />
          <button onClick={onToggle} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            ❌
          </button>
        </>
      )}
    </div>
  );
}

export default SearchToggleBar;
