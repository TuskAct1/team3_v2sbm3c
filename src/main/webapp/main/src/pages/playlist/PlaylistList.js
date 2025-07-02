import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import PlaylistForm from './PlaylistForm';     // 🎵 플레이리스트 등록/수정 폼
import EmotionForm from './EmotionForm';       // 😊 감정 카테고리 관리 폼
import './PlaylistList.css';                   // 🎨 외부 스타일

function PlaylistList() {
  // ✅ 상태 정의
  const [songs, setSongs] = useState([]);                        // 전체 플레이리스트 목록
  const [emotions, setEmotions] = useState([]);                  // 감정 카테고리 목록
  const [selectedEmotion, setSelectedEmotion] = useState(null);  // 선택된 감정 필터
  const [formMode, setFormMode] = useState(null);                // 등록/수정/삭제 모드
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);// 현재 선택된 플레이리스트
  const [showManageMode, setShowManageMode] = useState(false);   // 관리 모드 토글 여부
  const [showEmotionForm, setShowEmotionForm] = useState(false); // 감정 편집 모달 여부

  // 🔐 관리자 여부 확인 함수
  const isAdminUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.adminno != null; // adminno가 있으면 관리자
  };

  // ✅ 감정 목록 불러오기
  const fetchEmotions = useCallback(() => {
    axios.get('http://localhost:9093/playlist_emotion/list')
      .then(res => setEmotions(res.data))
      .catch(err => console.error('❌ 감정 목록 실패:', err));
  }, []);

  // ✅ 전체 플레이리스트 목록 불러오기
  const fetchPlaylists = useCallback(() => {
    axios.get('http://localhost:9093/playlist/list')
      .then(res => setSongs(res.data))
      .catch(err => console.error('❌ 플레이리스트 실패:', err));
  }, []);

  // ✅ 페이지 로딩 시 초기 실행
  useEffect(() => {
    fetchEmotions();
    fetchPlaylists();
  }, [fetchEmotions, fetchPlaylists]);

  // ✅ 감정 필터 버튼 클릭 시 실행
  const handleEmotionSelect = (emotionno) => {
    setSelectedEmotion(emotionno);
    if (emotionno === null) {
      fetchPlaylists(); // 전체 조회
    } else {
      axios.get(`http://localhost:9093/playlist/list_by_emotionno/${emotionno}`)
        .then(res => setSongs(res.data))
        .catch(err => console.error('❌ 감정별 필터 실패:', err));
    }
  };

  // ✅ 썸네일 추출 함수
  const getThumbnail = (song) => {
    if (song.thumbnail && song.thumbnail.startsWith('/playlist/storage/')) {
      return song.thumbnail;
    }
    if (song.youtubeurl) {
      const match = song.youtubeurl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      const videoId = match ? match[1] : null;
      return videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : '/default-thumbnail.png';
    }
    return '/default-thumbnail.png';
  };

  // ✅ 플레이리스트 클릭 시 곡 리스트 새 창 열기
  const openSongList = (playlistno) => {
    const width = 1000;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + 100;

    window.open(
      `/playlist_song/list/${playlistno}`,
      '_blank',
      `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=yes`
    );
  };

  // ✅ 등록/수정 모달 닫기
  const closeForm = useCallback(() => {
    setFormMode(null);
    setSelectedPlaylist(null);
    fetchPlaylists();
  }, [fetchPlaylists]);

  // ✅ 감정 편집 모달 닫기
  const closeEmotionForm = useCallback(() => {
    setShowEmotionForm(false);
    fetchEmotions();
  }, [fetchEmotions]);

  // ✅ ESC 눌렀을 때 모달 닫기
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

  return (
    <div className="list-container">
      <h2>📋 감정 플레이리스트</h2>

      {/* 🎛️ 관리 버튼 */}
      <div className="manage-top-right">
        <span
          className="manage-text"
          onClick={() => {
            if (!isAdminUser()) {
              alert('🔐 관리자만 접근할 수 있습니다.');
              // ✅ 현재 URL 저장
              localStorage.setItem('redirectAfterLogin', window.location.pathname);
              window.location.href = '/admin_login'; // 관리자 로그인 페이지로 이동
              return;
            }
            setShowManageMode(!showManageMode);
          }}
        >
          🎛️ 플레이리스트 관리
        </span>

        {/* 관리자 전용 버튼들 */}
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

      {/* 🎨 감정 필터 버튼들 */}
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

      {/* 🎵 플레이리스트 카드 */}
      <div className="song-grid">
        {songs.map((song) => (
          <div
            key={song.playlistno}
            className={`song-card ${showManageMode ? 'manage-mode' : ''}`}
            onClick={() => openSongList(song.playlistno)}
          >
            {/* 썸네일 이미지 */}
            <img
              src={getThumbnail(song)}
              alt={song.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-thumbnail.png';
              }}
            />

            {/* 제목 및 설명 */}
            <div className="song-info">
              <h3>{song.title}</h3>
              <p className="play-text">🎵 클릭해서 전체 곡 듣기</p>
            </div>

            {/* ✏️ 관리자 모드에서만 보임 */}
            {showManageMode && (
              <div className="action-buttons">
                <button onClick={(e) => {
                  e.stopPropagation();
                  setFormMode('update');
                  setSelectedPlaylist(song);
                }}>✏️ 수정</button>

                <button onClick={async (e) => {
                  e.stopPropagation();
                  const confirmDelete = window.confirm('🗑️ 삭제할까요?');
                  if (!confirmDelete) return;
                  try {
                    await axios.delete(`http://localhost:9093/playlist/delete/${song.playlistno}`);
                    alert('✅ 삭제 완료!');
                    fetchPlaylists();
                  } catch (err) {
                    console.error('❌ 삭제 실패:', err);
                    alert('❌ 삭제 중 오류 발생!');
                  }
                }}>🗑️ 삭제</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 📝 등록/수정 모달 */}
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

      {/* 🎨 감정 편집 모달 */}
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
