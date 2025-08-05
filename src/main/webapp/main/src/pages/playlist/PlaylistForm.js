import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PlaylistForm.css';

function PlaylistForm({ mode, playlist, onClose }) {
  const [emotionList, setEmotionList] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState(playlist?.playlistemotionno || '');
  const [title, setTitle] = useState(playlist?.title || '');
  const [description, setDescription] = useState(playlist?.description || '');  // DB에 description(타임라인)을 저장해야 점프 기능을 구현할 수 있고, 유지도 가능
  const [youtubeurl, setYoutubeurl] = useState(playlist?.youtubeurl || '');
  const [thumbnail, setThumbnail] = useState(playlist?.thumbnail || '');
  const [thumbnailInputType, setThumbnailInputType] = useState('upload');

  // 감정 카테고리 목록 불러오기
  useEffect(() => {
    axios.get('http://121.78.128.139:9093/playlist_emotion/list')
      .then(res => setEmotionList(res.data))
      .catch(err => console.error('❌ 감정 목록 실패:', err));
  }, []);

  // 수정 모드일 때 썸네일 타입 자동 결정
  useEffect(() => {
    if (playlist?.thumbnail) {
      if (playlist.thumbnail.startsWith('/playlist/storage/')) {
        setThumbnailInputType('upload');
      } else {
        setThumbnailInputType('url');
      }
    }
  }, [playlist]);

  // 썸네일 파일 업로드 후 콜백 전달
  const handleThumbnailUpload = async (file, callback) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://121.78.128.139:9093/playlist/upload-thumbnail', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      callback(res.data); // 업로드된 서버 경로 콜백으로 전달
    } catch (err) {
      console.error('❌ 썸네일 업로드 실패:', err);
      alert('❌ 썸네일 업로드에 실패했어요.');
    }
  };

  // 등록/수정/삭제 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    const doRegister = async (finalThumbnail) => {
      const payload = {
        playlistemotionno: selectedEmotion,
        title,
        description,
        youtubeurl,
        thumbnail: finalThumbnail,
        adminno: 1,
      };

      try {
        if (mode === 'create') {
          await axios.post('http://121.78.128.139:9093/playlist/create', payload);
          alert('✅ 플레이리스트가 등록되었습니다!');
        } else if (mode === 'update') {
          payload.playlistno = playlist.playlistno;
          await axios.put('http://121.78.128.139:9093/playlist/update', payload);
          alert('✏️ 플레이리스트가 수정되었습니다!');
        } else if (mode === 'delete') {
          await axios.delete(`http://121.78.128.139:9093/playlist/delete/${playlist.playlistno}`);
          alert('🗑️ 플레이리스트가 삭제되었습니다!');
        }

        // 초기화 후 닫기
        setSelectedEmotion('');
        setTitle('');
        setDescription('');
        setYoutubeurl('');
        setThumbnail('');
        onClose();
      } catch (err) {
        console.error(`❌ ${mode} 실패:`, err);
        alert('❌ 작업 중 오류가 발생했어요.');
      }
    };

    // 업로드 방식일 경우, 업로드 후 등록 처리
    if (thumbnailInputType === 'upload' && thumbnail.startsWith('blob:')) {
      const fileInput = document.querySelector('input[type="file"]');
      const file = fileInput?.files?.[0];

      if (file) {
        await handleThumbnailUpload(file, (uploadedPath) => {
          doRegister(uploadedPath);
        });
      } else {
        alert('❗ 썸네일 파일을 선택해주세요.');
      }
    } else {
      // URL 방식 또는 이미 업로드된 경로
      doRegister(thumbnail);
    }
  };

  // 파일 선택 시 미리보기 처리
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setThumbnail(previewUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="playlist-form">
      <h3>
        {mode === 'create' ? '🎵 플레이리스트 등록' :
         mode === 'update' ? '✏️ 플레이리스트 수정' :
         '🗑️ 플레이리스트 삭제'}
      </h3>

      <label>감정 카테고리</label>
      <select
        value={selectedEmotion}
        onChange={(e) => setSelectedEmotion(e.target.value)}
        required
      >
        <option value="">-- 감정을 선택하세요 --</option>
        {emotionList.map((e) => (
          <option key={e.playlistemotionno} value={e.playlistemotionno}>
            {e.emotion}
          </option>
        ))}
      </select>

      <label>제목</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>노래 타임라인</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <label>유튜브 플레이리스트 링크</label>
      <input
        type="text"
        value={youtubeurl}
        onChange={(e) => setYoutubeurl(e.target.value)}
        required
      />

      {/* 썸네일 입력 방식 선택 */}
      <label>썸네일 입력 방식</label>
      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="thumbType"
            value="upload"
            checked={thumbnailInputType === 'upload'}
            onChange={() => setThumbnailInputType('upload')}
          />
          이미지 파일 업로드
        </label>
        <label>
          <input
            type="radio"
            name="thumbType"
            value="url"
            checked={thumbnailInputType === 'url'}
            onChange={() => setThumbnailInputType('url')}
          />
          직접 URL 입력
        </label>
      </div>

      {/* 썸네일 파일 업로드 */}
      {thumbnailInputType === 'upload' && (
        <>
          <label>썸네일 파일 업로드</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </>
      )}

      {/* 썸네일 URL 입력 */}
      {thumbnailInputType === 'url' && (
        <>
          <label>썸네일 URL</label>
          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
          />
        </>
      )}

      {/* 썸네일 미리보기 (업로드 또는 서버 경로만) */}
      {thumbnail && (thumbnailInputType === 'upload' || thumbnail.startsWith('/playlist/storage/')) && (
        <div className="thumbnail-preview">
          <p>🖼️ 썸네일 미리보기</p>
          <img src={thumbnail.startsWith('blob:') ? thumbnail : `http://121.78.128.139:9093${thumbnail}`} alt="썸네일 미리보기" />
        </div>
      )}

      <button type="submit" className="submit-btn">
        {mode === 'create' ? '등록하기' :
         mode === 'update' ? '수정하기' : '삭제하기'}
      </button>
    </form>
  );
}

export default PlaylistForm;
