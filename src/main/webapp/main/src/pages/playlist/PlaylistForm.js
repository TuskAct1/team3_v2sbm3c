import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PlaylistForm({ mode, playlist, onClose }) {
  const [emotionList, setEmotionList] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState(playlist?.playlistemotionno || '');
  const [newEmotion, setNewEmotion] = useState(''); // 🔹 새 감정 입력 상태
  const [title, setTitle] = useState(playlist?.title || '');
  const [description, setDescription] = useState(playlist?.description || '');
  const [youtubeurl, setYoutubeurl] = useState(playlist?.youtubeurl || '');
  const [thumbnail, setThumbnail] = useState(playlist?.thumbnail || '');

  // ✅ 감정 카테고리 목록 불러오기
  useEffect(() => {
    fetchEmotions();
  }, []);

  const fetchEmotions = () => {
    axios.get('http://localhost:9093/playlist_emotion/list')
      .then(res => setEmotionList(res.data))
      .catch(err => console.error('❌ 감정 목록 불러오기 실패:', err));
  };

  // ✅ 새 감정 추가
  const handleAddEmotion = async () => {
    if (!newEmotion.trim()) {
      alert('감정 이름을 입력해주세요!');
      return;
    }

    try {
      await axios.post('http://localhost:9093/playlist_emotion/create', {
        emotion: newEmotion.trim()
      });
      alert(`감정 "${newEmotion}"이 추가되었어요!`);
      setNewEmotion('');
      fetchEmotions(); // 목록 갱신
    } catch (err) {
      console.error('❌ 감정 추가 실패:', err);
      alert('감정 추가에 실패했어요.');
    }
  };

  // ✅ 등록 또는 수정 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      playlistemotionno: selectedEmotion,
      title,
      description,
      youtubeurl,
      thumbnail,
      adminno: 1, // 실제 로그인 정보와 연동 필요
      ...(playlist?.playlistno && { playlistno: playlist.playlistno }) // 수정일 때만 추가
    };

    try {
      if (mode === 'create') {
        await axios.post('http://localhost:9093/playlist/create', payload);
        alert('✅ 플레이리스트가 등록되었어요!');
      } else if (mode === 'update') {
        await axios.put('http://localhost:9093/playlist/update', payload);
        alert('✅ 플레이리스트가 수정되었어요!');
      }
      onClose(); // 닫기 + 새로고침
    } catch (err) {
      console.error('❌ 저장 실패:', err);
      alert('오류가 발생했어요.');
    }
  };

  // ✅ 삭제 처리
  const handleDelete = async () => {
    if (!window.confirm('정말 삭제할까요?')) return;

    try {
      await axios.delete(`http://localhost:9093/playlist/delete/${playlist.playlistno}`);
      alert('🗑️ 삭제 완료!');
      onClose();
    } catch (err) {
      console.error('❌ 삭제 실패:', err);
      alert('삭제에 실패했어요.');
    }
  };

  return (
    <div className="playlist-form">
      <h3>
        {mode === 'create' && '➕ 플레이리스트 등록'}
        {mode === 'update' && '✏️ 플레이리스트 수정'}
        {mode === 'delete' && '🗑️ 플레이리스트 삭제'}
      </h3>

      {(mode === 'create' || mode === 'update') && (
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div>
            <label>감정 카테고리:</label><br />
            <select
              value={selectedEmotion}
              onChange={(e) => setSelectedEmotion(Number(e.target.value))}
              required
            >
              <option value="">감정을 선택하세요</option>
              {emotionList.map((emotion) => (
                <option key={emotion.playlistemotionno} value={emotion.playlistemotionno}>
                  {emotion.emotion}
                </option>
              ))}
            </select>

            {/* 🔹 감정 추가 입력창 */}
            <div style={{ marginTop: '0.5rem' }}>
              <input
                type="text"
                placeholder="새 감정 추가하기"
                value={newEmotion}
                onChange={(e) => setNewEmotion(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddEmotion}
                style={{ marginLeft: '0.5rem' }}
              >
                ➕ 추가
              </button>
            </div>
          </div>

          <div>
            <label>제목:</label><br />
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div>
            <label>설명:</label><br />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          <div>
            <label>유튜브 링크:</label><br />
            <input type="text" value={youtubeurl} onChange={(e) => setYoutubeurl(e.target.value)} required />
          </div>

          <div>
            <label>썸네일 주소:</label><br />
            <input type="text" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} required />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button type="submit">✅ 저장</button>
            <button type="button" onClick={onClose} style={{ marginLeft: '1rem' }}>❌ 닫기</button>
          </div>
        </form>
      )}

      {mode === 'delete' && (
        <div style={{ marginTop: '1rem' }}>
          <p>정말로 <strong>{playlist?.title}</strong> 플레이리스트를 삭제하시겠어요?</p>
          <button onClick={handleDelete}>🗑️ 삭제 확정</button>
          <button onClick={onClose} style={{ marginLeft: '1rem' }}>❌ 취소</button>
        </div>
      )}
    </div>
  );
}

export default PlaylistForm;
