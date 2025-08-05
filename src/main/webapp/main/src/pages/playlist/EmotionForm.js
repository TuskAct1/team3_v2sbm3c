import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EmotionForm({ onClose }) {
  const [emotionList, setEmotionList] = useState([]);
  const [newEmotion, setNewEmotion] = useState('');
  const [editModeId, setEditModeId] = useState(null); // 수정 중인 감정 ID
  const [editText, setEditText] = useState('');        // 수정 중 입력값

  // ✅ 감정 목록 불러오기
  const fetchEmotions = () => {
    axios.get('http://121.78.128.139:9093/playlist_emotion/list')
      .then(res => setEmotionList(res.data))
      .catch(err => console.error('❌ 감정 목록 실패:', err));
  };

  useEffect(() => {
    fetchEmotions();
  }, []);

  // ✅ 감정 등록
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newEmotion.trim()) return;
    try {
      await axios.post('http://121.78.128.139:9093/playlist_emotion/create', {
        emotion: newEmotion.trim(),
      });
      setNewEmotion('');
      fetchEmotions();
    } catch (err) {
      console.error('❌ 감정 등록 실패:', err);
    }
  };

  // ✅ 감정 수정 저장
  const handleUpdate = async (emotionId) => {
    if (!editText.trim()) return;
    try {
      await axios.put('http://121.78.128.139:9093/playlist_emotion/update', {
        playlistemotionno: emotionId,
        emotion: editText.trim(),
      });
      setEditModeId(null);
      setEditText('');
      fetchEmotions();
    } catch (err) {
      console.error('❌ 감정 수정 실패:', err);
    }
  };

  // ✅ 감정 삭제
  const handleDelete = async (emotionId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`http://121.78.128.139:9093/playlist_emotion/delete/${emotionId}`);
      fetchEmotions();
    } catch (err) {
      console.error('❌ 감정 삭제 실패:', err);
    }
  };

  return (
    <div>
      <h3>😊 감정 등록 및 관리</h3>

      {/* 🔹 새 감정 등록 */}
      <form onSubmit={handleAdd} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={newEmotion}
          onChange={(e) => setNewEmotion(e.target.value)}
          placeholder="예: 위로, 기쁨, 설렘"
          required
        />
        <button type="submit">➕ 등록</button>
      </form>

      {/* 🔹 감정 목록 */}
      <ul>
        {emotionList.map((emo) => (
          <li key={emo.playlistemotionno} style={{ marginBottom: '0.5rem' }}>
            {editModeId === emo.playlistemotionno ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => handleUpdate(emo.playlistemotionno)}>💾 저장</button>
                <button onClick={() => {
                  setEditModeId(null);
                  setEditText('');
                }}>❌ 취소</button>
              </>
            ) : (
              <>
                <span>{emo.emotion}</span>
                <button onClick={() => {
                  setEditModeId(emo.playlistemotionno);
                  setEditText(emo.emotion);
                }}>✏ 수정</button>
                <button onClick={() => handleDelete(emo.playlistemotionno)}>🗑 삭제</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* 닫기 버튼 */}
      <div style={{ textAlign: 'right', marginTop: '1rem' }}>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export default EmotionForm;
