// DiaryReadModal.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import LightboxViewer from './LightboxViewer';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './DiaryPage.css';
import './DiaryReadModal.css';

export default function DiaryReadModal({id, onClose, onSuccess, createMode = false}) {

  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [diary, setDiary] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editRiskFlag, setEditRiskFlag] = useState(3);

  const [existingImages, setExistingImages] = useState([]);
  const [deletedExistingImages, setDeletedExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([null, null, null, null]);
  const fileInputRefs = [useRef(), useRef(), useRef(), useRef()];

  const [isDefaultImage, setIsDefaultImage] = useState(false);
  const [defaultImageName, setDefaultImageName] = useState('');
  const [defaultImageBackup, setDefaultImageBackup] = useState('');
  const [isDefaultImageBackup, setIsDefaultImageBackup] = useState(false);

  const [lightboxIndex, setLightboxIndex] = useState(null);

  const [existingImagesBackup, setExistingImagesBackup] = useState([]);
  const [newImagesBackup, setNewImagesBackup] = useState([null, null, null, null]);

  const isReadMode = !createMode && !isEditMode;

  const hasNoImage = isReadMode && !defaultImageName && existingImages.length === 0;

  const emotionIcons = [
    { score: 1, icon: "😃", label: "긍정" },
    { score: 2, icon: "😠", label: "부정" },
    { score: 3, icon: "😐", label: "중립" },
    { score: 4, icon: "😰", label: "불안" },
    { score: 5, icon: "😢", label: "우울" },
  ];
  
  const emotionObj = emotionIcons.find(e => e.score === editRiskFlag) || { icon: "😐", label: "중립" };


  const getDefaultImageName = () => {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth() + 1;

    const season =
      month >= 3 && month <= 5
        ? 'spring'
        : month >= 6 && month <= 8
        ? 'summer'
        : month >= 9 && month <= 11
        ? 'autumn'
        : 'winter';

    const timeOfDay =
      hour >= 6 && hour < 12
        ? 'morning'
        : hour >= 12 && hour < 18
        ? 'day'
        : hour >= 18 && hour < 21
        ? 'evening'
        : 'night';

    return `${season}_${timeOfDay}.png`; // 예: spring_morning.png
  };

  useEffect(() => {
    if (createMode) {
      setDiary({});
      setIsEditMode(true);
      setEditTitle('');
      setEditContent('');
      setEditRiskFlag(3);
      setExistingImages([]);
      setDeletedExistingImages([]);
      setNewImages([null, null, null, null]);
      return;
    }

    axios.get(`/diary/read/${id}`)
      .then(res => {
        setDiary(res.data);
        setEditTitle(res.data.title);
        setEditContent(res.data.content);
        setEditRiskFlag(res.data.risk_flag ?? 3);
        const images = res.data.file1saved
          ? res.data.file1saved
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
          .filter(img => img !== res.data.default_image)
          : [];
        setExistingImages(images);
        setDefaultImageName(res.data.default_image || '');
      })
      .catch(() => {
        alert('불러오기 실패');
        onClose();
      });
  }, [id, onClose, createMode]);

  useEffect(() => {
    if (!createMode && isEditMode) {
      setNewImages([null, null, null, null]);
    }
  }, [isEditMode, createMode]);

  useEffect(() => {
  if (!createMode && diary?.file1saved && existingImages.length === 0) {
    const images = diary.file1saved
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .filter(img => img !== diary.default_image); // ✅ default 이미지 제거
    setExistingImages(images);
  }
}, [diary, createMode]);


  const handleEnterEditMode = () => {

    setIsEditMode(true);

    setExistingImagesBackup([...existingImages]);
    setNewImagesBackup([...newImages]);

    // ✅ 기본 이미지 설정 상태 적용
    if (diary?.default_image) {
      setIsDefaultImage(true);
      setDefaultImageName(diary.default_image);

      // 👉 백업
      setIsDefaultImageBackup(true);
      setDefaultImageBackup(diary.default_image);
    } else {
      setIsDefaultImage(false);
      setDefaultImageName('');

      // 👉 백업
      setIsDefaultImageBackup(false);
      setDefaultImageBackup('');
    }
  };

  const handleCancelEdit = () => {
    if (createMode) {
      onClose();
    } else {
      // ✅ 기본 이미지 상태 복구
      setIsDefaultImage(isDefaultImageBackup);
      setDefaultImageName(defaultImageBackup);

      // ✅ 이미지 상태 복구
      setExistingImages([...existingImagesBackup]);
      setNewImages([...newImagesBackup]);

      setIsEditMode(false);
    }
  };

  const handleToggleDefaultImage = () => {
    if (isDefaultImage) {
      setIsDefaultImage(false);
      setDefaultImageName('');
    } else {
      const name = getDefaultImageName();
      setIsDefaultImage(true);
      setDefaultImageName(name);

      // 🧹 기존 이미지 초기화
      setNewImages([null, null, null, null]);
      setExistingImages([]);
      setDeletedExistingImages([]);
    }
  };

  const handleSelectImage = (index, e) => {
    const file = e.target.files?.[0];
    if (!file || !(file instanceof File)) return;

    const updated = [...newImages];
    updated[index] = file;
    setNewImages(updated);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/diary/delete/${id}`);
      alert('삭제되었습니다.');
      onClose();
      onSuccess?.(id);
    } catch (err) {
      console.error(err);
      alert('삭제 실패');
    }
  };

  const handleSaveUpdate = async () => {
    if (!editTitle.trim()) {
      alert('제목을 입력해주세요!');
      return;
    }
    if (!editContent.trim()) {
      alert('내용을 입력해주세요!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', editTitle);
      formData.append('content', editContent);
      formData.append('password', '1234');
      formData.append('risk_flag', editRiskFlag);
      formData.append('memberno', createMode
        ? JSON.parse(localStorage.getItem("user")).memberno
        : diary.memberno);

      // ✅ 기본 이미지일 경우
      if (isDefaultImage) {
        formData.append('isDefaultImage', 'true');
        formData.append('default_image', defaultImageName);
      } else {
        // ✅ 기본 이미지 아님 (사용자 업로드 이미지 사용)
        formData.append('isDefaultImage', 'false');
        newImages.forEach((file, index) => {
          if (file) {
            formData.append('files', file);
            if (index === 0) formData.append('mainImageIndex', '0');
          }
        });
        deletedExistingImages.forEach(name => formData.append('deletedFiles', name));
        existingImages.forEach(name => {
          formData.append('remainFilesSaved', name);
          formData.append('remainFiles', name);
        });
      }

      if (createMode) {
        const res = await axios.post('/diary/create', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('작성 완료!');
        onSuccess?.(res.data);
        onClose();
        window.location.reload();
      } else {
        await axios.put(`/diary/update/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('수정 완료!');
        setIsEditMode(false);
        onSuccess?.({
          diaryno: id,
          title: editTitle,
          content: editContent,
          rdate: new Date().toISOString(), // 또는 diary.rdate 유지해도 무방
          risk_flag: editRiskFlag,
        });
      }
    } catch (err) {
      console.error(err);
      alert('저장 실패');
    }
  };

  return (
    <div className="diary-modal-overlay">
      <div className="diary-modal-container">
        {/* 왼쪽 - 이미지 영역 */}
        {!hasNoImage && (
          <div className="diary-image-section">
            {isEditMode ? (
              isDefaultImage ? (
                <div className="diary-default-image-wrapper">
                  <img
                    src={`/diary/images/${defaultImageName}`}
                    alt="기본 이미지"
                    className="diary-default-image"
                  />
                </div>
            ) : (
              (() => {
                const totalImages = [
                  ...existingImages.filter((img) => img && img !== defaultImageName),
                  ...newImages.filter((img) => img instanceof File),
                ].slice(0, 4);

                const imageBoxList = totalImages.map((img, idx) => {
                  const isFile = img instanceof File;
                  const previewUrl = isFile
                    ? URL.createObjectURL(img)
                    : `/diary/storage/${encodeURIComponent(img)}`;

                  const isNew = isFile || newImages.includes(img);

                  return (
                    <div
                      key={`img-${idx}`}
                      className={`diary-img-box ${idx === 0 ? 'main' : 'sub'}`}
                      onClick={() => fileInputRefs[idx]?.current?.click()}
                    >
                      <img
                        src={previewUrl}
                        alt={`이미지 ${idx}`}
                        className="diary-img-preview"
                      />

                      <img
                        src="/diary/images/remove.png"
                        alt="삭제"
                        className="diary-img-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isNew) {
                            const updated = [...newImages];
                            updated[idx] = null;
                            setNewImages(updated);
                          } else {
                            const updated = [...existingImages];
                            updated.splice(idx, 1);
                            setExistingImages(updated);
                            setDeletedExistingImages((prev) => [...prev, img]);
                          }
                        }}
                      />

                      {isNew && (
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          ref={fileInputRefs[idx]}
                          onChange={(e) => handleSelectImage(idx, e)}
                        />
                      )}
                    </div>
                  );
                });

                const emptyBox = (idx) => (
                  <div
                    key={`empty-${idx}`}
                    className={`diary-img-empty-box ${idx === 0 ? 'main' : 'sub'}`}
                    onClick={() => fileInputRefs[idx]?.current?.click()}
                  >
                    <span className="diary-img-empty-label">
                      {idx === 0 ? '메인 이미지' : `이미지 ${idx}`}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      ref={fileInputRefs[idx]}
                      onChange={(e) => handleSelectImage(idx, e)}
                    />
                  </div>
                );

                return (
                  <div className="diary-img-wrapper">
                    <div className="diary-img-group">
                      {/* 메인 이미지 */}
                      <div className="diary-img-main">
                        {imageBoxList[0] || emptyBox(0)}
                      </div>

                      {/* 하단 서브 이미지 */}
                      <div className="diary-img-sub-list">
                        {[1, 2, 3].map((idx) => (
                          <div key={idx} className="diary-img-sub-box">
                            {imageBoxList[idx] || emptyBox(idx)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()
            )
          ) : (
            // ✅ 읽기 모드
            (() => {
              const totalImages = defaultImageName
                ? [defaultImageName, ...existingImages.filter(img => img !== defaultImageName)].slice(0, 4)
                : existingImages.slice(0, 4);

              const isDefaultImage = totalImages[0] === defaultImageName;

              return (
                <div className="diary-read-wrapper">
                  <div className="diary-read-container">
                    <div
                      className={`diary-read-main ${isDefaultImage ? 'default' : ''}`}
                    >
                      {totalImages[0] ? (
                        <img
                          src={isDefaultImage
                            ? `/diary/images/${defaultImageName}`
                            : `/diary/storage/${encodeURIComponent(totalImages[0])}`}
                          alt="메인 이미지"
                          className={`diary-read-main-img ${isDefaultImage ? '' : 'clickable'}`}
                          onClick={() => {
                            if (!isDefaultImage) setLightboxIndex(0);
                          }}
                        />
                      ) : (
                        <p className="diary-read-no-img">이미지 없음</p>
                      )}
                    </div>

                    {!isDefaultImage && (
                      <div className="diary-read-sub-imgs">
                        {[1, 2, 3].map((idx) => (
                          <div
                            key={idx}
                            className={`diary-read-sub-img-box ${idx === 3 ? 'last' : ''}`}
                          >
                            {totalImages[idx] ? (
                              <img
                                src={`/diary/storage/${encodeURIComponent(totalImages[idx])}`}
                                alt={`서브 이미지 ${idx}`}
                                className="diary-read-sub-img"
                                onClick={() => setLightboxIndex(idx)}
                              />
                            ) : (
                              <div className="diary-read-sub-img-placeholder" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {isReadMode && (
                    <LightboxViewer
                      fileList={totalImages.map((img) =>
                        img === defaultImageName ? defaultImageName : encodeURIComponent(img)
                      )}
                      lightboxIndex={lightboxIndex}
                      setLightboxIndex={setLightboxIndex}
                    />
                  )}
                </div>
              );
            })()
          )}
        </div>
      )}

        {/* 오른쪽 - 내용 영역 */}
        <div className={`diary-right-panel ${hasNoImage ? 'no-image' : ''}`}>
          <div className="diary-header">
            <h3 className="diary-header-title">
              {isReadMode
                ? '📖 일기 보기'
                : (createMode ? '✏️ 새 일기 작성' : '✏️ 수정 모드')}
            </h3>
            <button
              onClick={onClose}
              onMouseEnter={() => setIsCloseHovered(true)}
              onMouseLeave={() => setIsCloseHovered(false)}
              className="diary-close-btn"
            >
              <img
                src={isCloseHovered ? '/diary/images/close_cursor.png' : '/diary/images/close.png'}
                alt="닫기"
                className="diary-close-icon"
              />
            </button>
          </div>

          {isReadMode ? (
            <>
              <h3 className="diary-section-label">제목</h3>
              <div className='title'>{diary?.title}</div>

              <h3 className="diary-section-label">내용</h3>
              <div
                className="diary-content"
                dangerouslySetInnerHTML={{ __html: diary?.content }}
              />

              <p style={{marginBottom: "10px"}}>
                <strong>감정:</strong>{' '}
                <span className="emotion-icon">{emotionObj.icon}</span>{' '}
                <span className="emotion-label">{emotionObj.label}</span>
              </p>


              <p><strong>날짜:</strong> {diary?.rdate}</p>
{/* 
//               <div className="diary-footer-buttons">
//                 <button onClick={handleEnterEditMode} className="diary-btn diary-btn-edit">수정</button>
//                 <button onClick={handleDelete} className="diary-btn diary-btn-delete">삭제</button> */}


              <div className="diary-bottom-row">
                <p style={{marginBottom: "10px"}}><strong>날짜:</strong> {diary?.rdate}</p>

                <div className="diary-footer-buttons">
                  <button onClick={handleEnterEditMode} className="diary-btn diary-btn-edit">수정</button>
                  <button onClick={handleDelete} className="diary-btn diary-btn-delete">삭제</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="diary-section-label">제목</h3>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="제목"
                className="title title-input"
              />

              <h3 className="diary-section-label">내용</h3>
              <ReactQuill
                value={editContent}
                onChange={setEditContent}
                placeholder="내용을 입력하세요"
                className="custom-quill"
              />

              <div className="diary-emotion-group">
                <strong>감정:</strong>
                <div className="diary-emotion-icons">
                  {emotionIcons.map(({ score, icon, label }) => (
                    <div
                      key={score}
                      onClick={() => setEditRiskFlag(score)}
                      title={label}
                      className={`diary-emotion-icon ${editRiskFlag === score ? 'active' : ''}`}
                    >
                      {icon}
                    </div>
                  ))}
                </div>
              </div>

              <div className="diary-footer-buttons">
                {isEditMode && (
                  <button
                    onClick={handleToggleDefaultImage}
                    className={`diary-btn ${isDefaultImage ? 'diary-btn-default-cancel' : 'diary-btn-default-set'}`}
                  >
                    {isDefaultImage ? '기본 이미지 취소' : '기본 이미지 설정'}
                  </button>
                )}
                <button onClick={handleSaveUpdate} className="diary-btn diary-btn-edit">저장</button>
                <button onClick={handleCancelEdit} className="diary-btn diary-btn-cancel">취소</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}