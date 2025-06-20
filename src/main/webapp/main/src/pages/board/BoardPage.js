import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BoardPage() {
  const [categoryGroup, setCategoryGroup] = useState([]);
  const [boardList, setBoardList] = useState([]);

  useEffect(() => {
    axios
      .get('/board/list_all_json')
      .then((res) => {
        setCategoryGroup(res.data.categoryGroup);
        setBoardList(res.data.list);
      })
      .catch((err) => {
        console.error('게시판 데이터 불러오기 실패:', err);
      });
  }, []);

  return (
    <div>
      <h1>게시판 목록</h1>

      <div>
        {categoryGroup.map((cat) => (
          <a key={cat.categoryno} href={`/board/list_category/${cat.categoryno}`} style={{ marginRight: '10px' }}>
            {cat.name}
          </a>
        ))}
      </div>

      <div>
        {boardList.map((board) => (
          <div key={board.boardno} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
            <h3>{board.title}</h3>
            <p>{board.content.length > 160 ? `${board.content.substring(0, 160)}...` : board.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardPage;
