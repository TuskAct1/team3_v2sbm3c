import React from 'react';

// 카테고리 그룹 버튼 컴포넌트
function CategoryGroupBar({ categoryGroup, selected, onChange }) {
  return (
    <div style={{
      display: 'flex',
      overflowX: 'auto',
      gap: 12,
      padding: "14px 12px 10px 12px",
      background: "#f7f8fa",
      borderBottom: "1px solid #e5e6eb"
    }}>
      {/* 전체 카테고리 */}
      <button
        key="all"
        onClick={() => onChange('all')}
        style={{
          minWidth: 76,
          height: 40,
          background: "#fff",
          border: selected === 'all'
            ? "2px solid #4662e1"
            : "1.5px solid #dbe1ea",
          color: selected === 'all' ? "#4662e1" : "#36393f",
          borderRadius: 20,
          fontWeight: selected === 'all' ? 700 : 500,
          fontSize: 16,
          outline: "none",
          cursor: "pointer",
          boxShadow: selected === 'all'
            ? "0 0 0 2px #dbe5f9"
            : "0 1px 3px rgba(30,32,37,0.03)",
          transition: "border 0.2s, color 0.2s"
        }}
      >
        전체
      </button>

      {/* 게시판 카테고리 그룹 */}
      {categoryGroup.map(categoryVO => (
        <button
          key={categoryVO.categoryno}
          onClick={() => onChange(String(categoryVO.categoryno))}
          style={{
            minWidth: 76,
            height: 40,
            background: "#fff",
            border: selected === String(categoryVO.categoryno)
              ? "2px solid #4662e1"
              : "1.5px solid #dbe1ea",
            color: selected === String(categoryVO.categoryno) ? "#4662e1" : "#36393f",
            borderRadius: 20,
            fontWeight: selected === String(categoryVO.categoryno) ? 700 : 500,
            fontSize: 16,
            outline: "none",
            cursor: "pointer",
            boxShadow: selected === String(categoryVO.categoryno)
              ? "0 0 0 2px #dbe5f9"
              : "0 1px 3px rgba(30,32,37,0.03)",
            transition: "border 0.2s, color 0.2s"
          }}
        >
          {categoryVO.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryGroupBar;