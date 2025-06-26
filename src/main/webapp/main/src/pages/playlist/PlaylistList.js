// 📁 PlaylistList.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import PlaylistForm from './PlaylistForm';     // 🎵 플레이리스트 등록/수정 폼
import EmotionForm from './EmotionForm';       // 😊 감정 카테고리 관리 폼
import './PlaylistList.css';                   // 🎨 외부 스타일 파일

function PlaylistList() {
  // ✅ 상태 정의
  const [songs, setSongs] = useState([]);                    // 전체 플레이리스트 목록
  const [emotions, setEmotions] = useState([]);              // 감정 카테고리 목록
  const [selectedEmotion, setSelectedEmotion] = useState(null); // 선택된 감정 필터
  const [formMode, setFormMode] = useState(null);            // 등록/수정/삭제 모드
  const [selectedPlaylist, setSelectedPlaylist] = useState(null); // 현재 선택된 플레이리스트
  const [showManageMode, setShowManageMode] = useState(false);    // 🎛️ 관리 모드 활성화 여부
  const [showEmotionForm, setShowEmotionForm] = useState(false);  // 감정 관리 모달 열림 여부

  // ✅ 감정 목록 불러오기
  const fetchEmotions = useCallback(() => {
    axios.get('http://localhost:9093/playlist_emotion/list')
      .then(res => setEmotions(res.data))
      .catch(err => console.error('❌ 감정 목록 실패:', err));
  }, []);

  // ✅ 전체 플레이리스트 불러오기
  const fetchPlaylists = useCallback(() => {
    axios.get('http://localhost:9093/playlist/list')
      .then(res => setSongs(res.data))
      .catch(err => console.error('❌ 플레이리스트 실패:', err));
  }, []);

  // ✅ 페이지 로드시 감정 목록 + 플레이리스트 불러오기
  useEffect(() => {
    fetchEmotions();
    fetchPlaylists();
  }, [fetchEmotions, fetchPlaylists]);

  // ✅ 감정 선택 시 필터링된 플레이리스트 조회
  const handleEmotionSelect = (emotionno) => {
    setSelectedEmotion(emotionno);
    if (emotionno === null) {
      fetchPlaylists();
    } else {
      axios.get(`http://localhost:9093/playlist/list_by_emotionno/${emotionno}`)
        .then(res => setSongs(res.data))
        .catch(err => console.error('❌ 감정별 필터 실패:', err));
    }
  };

  // ✅ 유튜브 썸네일 주소 추출
  const getYoutubeThumbnail = (youtubeurl) => {
    if (!youtubeurl) return '';
    const match = youtubeurl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const videoId = match ? match[1] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : '';
  };

  // ✅ 플레이리스트 클릭 시 새 창으로 곡 리스트 열기
  const openSongList = (playlistno) => {
    const width = 1000, height = 800;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    window.open(`/playlist_song/list/${playlistno}`, '_blank',
      `width=${width},height=${height},left=${left},top=${top}`);
  };

  // ✅ ESC 키 누르면 모달 닫기 - useCallback과 useEffect로 연결
  const closeForm = useCallback(() => {
    setFormMode(null);
    setSelectedPlaylist(null);
    fetchPlaylists(); // 목록 새로고침
  }, [fetchPlaylists]);

  const closeEmotionForm = useCallback(() => {
    setShowEmotionForm(false);
    fetchEmotions(); // 감정 목록 새로고침
  }, [fetchEmotions]);

  // ✅ ESC 키 이벤트 리스너 등록
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeForm();
        closeEmotionForm();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeForm, closeEmotionForm]);

  // ✅ 컴포넌트 렌더링
  return (
    <div className="list-container">
      <h2>📋 감정 플레이리스트</h2>

      {/* 🔧 상단 관리 버튼 */}
      <div className="manage-top-right">
        <span className="manage-text" onClick={() => setShowManageMode(!showManageMode)}>
          🎛️ 플레이리스트 관리
        </span>

        {showManageMode && (
          <div className="manage-options">
            <button onClick={() => {
              setFormMode('create');
              setSelectedPlaylist(null);
            }}>➕ 플레이리스트 등록</button>

            <button onClick={() => {
              setShowEmotionForm(true);
            }}>➕ 감정 편집</button>
          </div>
        )}
      </div>

      {/* 🎨 감정 필터 버튼 목록 */}
      <div className="emotion-buttons">
        <button
          className={!selectedEmotion ? 'active' : ''}
          onClick={() => handleEmotionSelect(null)}
        >전체</button>
        {emotions.map(e => (
          <button
            key={e.playlistemotionno}
            className={selectedEmotion === e.playlistemotionno ? 'active' : ''}
            onClick={() => handleEmotionSelect(e.playlistemotionno)}
          >{e.emotion}</button>
        ))}
      </div>

      {/* 🎵 플레이리스트 카드들 */}
      <div className="song-grid">
        {songs.map((song) => (
          <div
            key={song.playlistno}
            className={`song-card ${showManageMode ? 'manage-mode' : ''}`}
            onClick={() => openSongList(song.playlistno)}
          >
            {/* ▶ 썸네일 이미지 */}
            <img
              src={getYoutubeThumbnail(song.youtubeurl)}
              alt={song.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-thumbnail.png';
              }}
            />

            {/* ▶ 제목 + 안내 텍스트 */}
            <div className="song-info">
              <h3>{song.title}</h3>
              <p className="play-text">🎵 클릭해서 전체 곡 듣기</p>
            </div>

            {/* ✏️ 수정/삭제 버튼 (관리 모드일 때만 노출) */}
            {showManageMode && (
              <div className="action-buttons">
                <button onClick={(e) => {
                  e.stopPropagation(); // 카드 클릭 막기
                  setFormMode('update');
                  setSelectedPlaylist(song);
                }}>✏️ 수정</button>

                <button onClick={(e) => {
                  e.stopPropagation();
                  setFormMode('delete');
                  setSelectedPlaylist(song);
                }}>🗑️ 삭제</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 📝 등록/수정/삭제 모달 */}
      {formMode && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target.classList.contains('modal-overlay')) {
            closeForm();
          }
        }}>
          <div className="modal-content">
            <button className="modal-close" onClick={closeForm}>✖</button>
            <PlaylistForm
              mode={formMode}
              playlist={selectedPlaylist}
              onClose={closeForm}
            />
          </div>
        </div>
      )}

      {/* 🎨 감정 관리 모달 */}
      {showEmotionForm && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target.classList.contains('modal-overlay')) {
            closeEmotionForm();
          }
        }}>
          <div className="modal-content">
            <button className="modal-close" onClick={closeEmotionForm}>✖</button>
            <EmotionForm onClose={closeEmotionForm} />
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaylistList;
