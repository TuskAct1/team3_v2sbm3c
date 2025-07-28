// ✅ 감정별 플레이리스트 목록 페이지 (좋아요 연동 포함)
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import PlaylistForm from './PlaylistForm';
import EmotionForm from './EmotionForm';
import './PlaylistList.css';

function PlaylistList() {
  const [songs, setSongs] = useState([]);
  const [emotions, setEmotions] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [formMode, setFormMode] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showManageMode, setShowManageMode] = useState(false);
  const [showEmotionForm, setShowEmotionForm] = useState(false);
  const [user, setUser] = useState(undefined); 
  const [showOnlyLiked, setShowOnlyLiked] = useState(false); // ✅ 좋아요만 보기 여부

  const isAdminUser = () => user && user.adminno != null;

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    try {
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null); // ❗ 비로그인 상태임을 명시적으로 알려줌
      }
    } catch (e) {
      console.error("유저 파싱 오류", e);
      setUser(null); // ❗ 파싱 실패 시도 비로그인으로 처리
    }
  }, []);

  const fetchEmotions = useCallback(() => {
    axios.get('http://localhost:9093/playlist_emotion/list')
      .then(res => setEmotions(res.data))
      .catch(err => console.error('❌ 감정 목록 실패:', err));
  }, []);

  const fetchPlaylists = useCallback(() => {
    const memberno = user?.memberno || 0;

    if (showOnlyLiked) {
      axios.get(`http://localhost:9093/playlist_like/my_likes/${user.memberno}`)
        .then(res => setSongs(res.data))
        .catch(err => console.error('❌ 좋아요 목록 실패:', err));
    } else if (selectedEmotion) {
      axios.get(`http://localhost:9093/playlist/list_by_emotionno_with_like/${selectedEmotion}/${memberno}`)
        .then(res => setSongs(res.data))
        .catch(err => console.error('❌ 감정별 필터 실패:', err));
    } else {
      axios.get(`http://localhost:9093/playlist/list_with_like/${memberno}`)
        .then(res => setSongs(res.data))
        .catch(err => console.error('❌ 플레이리스트 실패:', err));
    }
  }, [user, selectedEmotion, showOnlyLiked]);

  // 감정은 user 없이 불러도 되므로 따로
  useEffect(() => {
    fetchEmotions();
  }, [fetchEmotions]);

  useEffect(() => {
    // user가 초기화(로딩)된 후 실행: 로그인 안 했어도 fetch 실행
    if (user !== undefined) {
      fetchPlaylists();
    }
  }, [user, fetchPlaylists]);

  const handleEmotionSelect = (emotionno) => {
    setSelectedEmotion(emotionno);
    setShowOnlyLiked(false); // ✅ 감정 선택 시 좋아요 필터 해제
  };

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

  const toggleLike = async (playlistno) => {
    if (!user) {
      alert('🔐 로그인 후 이용해주세요!');
      localStorage.setItem('redirectAfterLogin', window.location.pathname); // 로그인 후 돌아올 페이지 저장
      window.location.href = '/login'; // 로그인 페이지로 이동
      return;
    }

    try {
      // 1️⃣ 좋아요 토글 실행
      await axios.post(`http://localhost:9093/playlist_like/toggle`, {
        playlistno,
        memberno: user.memberno
      });

      // 2️⃣ 목록 전체 다시 새로고침
      fetchPlaylists();  // ✅ 이거 하나면 확실하게 반영돼!

    } catch (err) {
      console.error("❌ 좋아요 토글 실패", err);
    }
  };


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

  // 폼 닫기 함수들 (ESC 포함)
  const closeForm = useCallback(() => {
    setFormMode(null);
    setSelectedPlaylist(null);
    fetchPlaylists();
  }, [fetchPlaylists]);

  const closeEmotionForm = useCallback(() => {
    setShowEmotionForm(false);
    fetchEmotions();
  }, [fetchEmotions]);

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
      <h2>🎵 감정 플레이리스트</h2>

      {isAdminUser() && (
        <div className="manage-top-right">
          <span
            className="manage-text"
            onClick={() => setShowManageMode(!showManageMode)}
          >
            🎛️ 플레이리스트 관리
          </span>

          {showManageMode && (
            <div className="manage-options">
              <button onClick={() => {
                setFormMode('create');
                setSelectedPlaylist(null);
              }}>➕ 플레이리스트 등록</button>

              <button onClick={() => setShowEmotionForm(true)}>➕ 감정 편집</button>
            </div>
          )}
        </div>
      )}

      <div className="emotion-buttons">
        <button className={!selectedEmotion && !showOnlyLiked ? 'active' : ''} onClick={() => handleEmotionSelect(null)}>
          전체
        </button>
        {emotions.map(e => (
          <button
            key={e.playlistemotionno}
            className={selectedEmotion === e.playlistemotionno ? 'active' : ''}
            onClick={() => handleEmotionSelect(e.playlistemotionno)}
          >{e.emotion}</button>
        ))}
        <button
          className={showOnlyLiked ? 'active' : ''}
          onClick={() => {
            if (!user) {
              alert('🔐 로그인 후 이용 가능합니다!');
              localStorage.setItem('redirectAfterLogin', window.location.pathname); // 로그인 후 돌아올 페이지 저장
              window.location.href = '/login'; // 로그인 페이지로 이동
              return;
            }
            setSelectedEmotion(null);
            setShowOnlyLiked(true);
          }}
        >❤️ 좋아요한 플레이리스트</button>
      </div>

      <div className="song-grid">
        {songs.map((song) => (
          <div
            key={song.playlistno}
            className={`song-card ${showManageMode ? 'manage-mode' : ''}`}
            onClick={() => openSongList(song.playlistno)}
          >
            <div
              className={`like-button ${song.liked ? 'liked' : 'unliked'}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(song.playlistno);
              }}
            >
              {song.liked ? '❤️' : '🤍'} {song.likecount}
            </div>

            <img
              src={getThumbnail(song)}
              alt={song.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-thumbnail.png';
              }}
            />

            <div className="song-info">
              <h3>{song.title}</h3>
              <p className="play-text">🎵 클릭해서 전체 곡 듣기</p>
            </div>

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

      {formMode && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target.classList.contains('modal-overlay')) closeForm();
        }}>
          <div className="modal-content">
            <button className="modal-close" onClick={closeForm}>✖</button>
            <PlaylistForm mode={formMode} playlist={selectedPlaylist} onClose={closeForm} />
          </div>
        </div>
      )}

      {showEmotionForm && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target.classList.contains('modal-overlay')) closeEmotionForm();
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