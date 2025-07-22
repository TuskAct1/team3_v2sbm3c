// DiaryReadModal.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  adaptiveHeight: true,
};

export default function DiaryReadModal({
  id,
  onClose,
  onSuccess,
  createMode = false
}) {
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
  const [sliderIndex, setSliderIndex] = useState(0);

  const fileInputRef = useRef();
  const sliderRef = useRef();

  const [isDefaultImage, setIsDefaultImage] = useState(false);
  const [defaultImageName, setDefaultImageName] = useState('');
  const [defaultImagePath, setDefaultImagePath] = useState('');
  const [defaultImageBackup, setDefaultImageBackup] = useState('');
  const [isDefaultImageBackup, setIsDefaultImageBackup] = useState(false);

  const isReadMode = !createMode && !isEditMode;

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
          ? res.data.file1saved.split(',').map(s => s.trim()).filter(Boolean)
          : [];
        setExistingImages(images);
      })
      .catch(() => {
        alert('불러오기 실패');
        onClose();
      });
  }, [id, onClose, createMode]);

  const emotionIcons = [
    { score: 1, icon: "😃", label: "긍정" },
    { score: 2, icon: "😠", label: "부정" },
    { score: 3, icon: "😐", label: "중립" },
    { score: 4, icon: "😰", label: "불안" },
    { score: 5, icon: "😢", label: "우울" },
  ];
  const emotionObj = emotionIcons.find(e => e.score === editRiskFlag) || { icon: "😐", label: "중립" };

  const handleEnterEditMode = () => {
    setIsEditMode(true);
    setSliderIndex(0);
    sliderRef.current?.slickGoTo(0);

    // ✅ 기존 이미지 4개를 newImages에 채워 넣기
    // const filled = [null, null, null, null];
    // existingImages.forEach((img, i) => {
    //   if (i < 4) filled[i] = `/diary/storage/${encodeURIComponent(img)}`;
    // });
    // setNewImages(filled);

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

      setIsEditMode(false);
      setSliderIndex(0);
      sliderRef.current?.slickGoTo(0);
    }
  };


  const handleToggleDefaultImage = () => {
    if (isDefaultImage) {
      setIsDefaultImage(false);
      setDefaultImageName('');
      setDefaultImagePath('');
    } else {
      const name = getDefaultImageName();
      setIsDefaultImage(true);
      setDefaultImageName(name);
      setDefaultImagePath(`/diary/images/${name}`);

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

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const handleRemoveExistingImage = (idx) => {
    setDeletedExistingImages(prev => [...prev, existingImages[idx]]);
    setExistingImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveNewImage = (idx) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx));
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


  console.log("✅ diary.default_image:", diary?.default_image);

  const uploadBoxStyle = {
    width: '100px',
    height: '100px',
    border: '2px dashed #ccc',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: '#f9f9f9',
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        width: '60%',
        height: '70%',
        background: '#fff',
        borderRadius: '12px',
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'row',
      }}>
        {/* 왼쪽 - 이미지 영역 */}
        <div style={{
          flex: 1.25,
          paddingRight: '20px',
          borderRight: '1px solid #eee',
          overflow: 'hidden',
          textAlign: 'center'
        }}>
          {isEditMode ? (
            isDefaultImage ? (
              <div style={{ marginTop: '20px' }}>
                <img
                  src={`/diary/images/${defaultImageName}`}
                  alt="기본 이미지"
                  style={{
                    width: '210px',
                    height: '210px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                justifyContent: 'center',
                marginTop: '20px'
              }}>
                {existingImages.map((img, idx) => (
                  <div
                    key={`existing-${idx}`}
                    style={{
                      width: idx === 0 ? '210px' : '100px',
                      height: idx === 0 ? '210px' : '100px',
                      border: '2px dashed #ccc',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backgroundColor: '#f9f9f9',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={`/diary/storage/${encodeURIComponent(img)}`}
                      alt={`기존 이미지 ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />

                    {/* 삭제 버튼 */}
                    <img
                      src="/diary/images/remove.png"
                      alt="삭제"
                      onClick={() => handleRemoveExistingImage(idx)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                      }}
                    />
                  </div>
                ))}
                {newImages.map((file, idx) => {
                  const isValidFile = file instanceof File || typeof file === 'string';
                  return (
                    <div
                      key={idx}
                      style={{
                        width: idx === 0 ? '210px' : '100px',
                        height: idx === 0 ? '210px' : '100px',
                        border: '2px dashed #ccc',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backgroundColor: '#f9f9f9',
                        position: 'relative',
                      }}
                    >
                      {/* 이미지 미리보기 or 텍스트 */}
                      {isValidFile ? (
                        <img
                          src={file instanceof File ? URL.createObjectURL(file) : file}
                          alt={`preview-${idx}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                          onClick={() => fileInputRefs[idx].current.click()}  // 클릭 시 업로드
                        />
                      ) : (
                        <span
                          onClick={() => fileInputRefs[idx].current.click()}
                          style={{ color: '#aaa', fontSize: '0.9rem' }}
                        >
                          {idx === 0 ? '메인 이미지' : `이미지 ${idx + 1}`}
                        </span>
                      )}

                      {/* 삭제 버튼 */}
                      {isValidFile && (
                        <img
                          src="/diary/images/remove.png"
                          alt="삭제"
                          onClick={(e) => {
                            e.stopPropagation(); // 파일 선택창 방지
                            const updated = [...newImages];
                            updated[idx] = null;
                            setNewImages(updated);
                          }}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer',
                          }}
                        />
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        ref={fileInputRefs[idx]}
                        onChange={(e) => handleSelectImage(idx, e)}
                      />
                    </div>
                  );
                })}

              </div>
            )
          ) : (
            <div style={{ marginTop: '20px' }}>
              {diary?.default_image ? (
                // ✅ 기본 이미지가 있을 경우
                <img
                  src={`/diary/images/${diary.default_image}`}
                  alt="기본 이미지"
                  style={{
                    width: '210px',
                    height: '210px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    margin: '5px'
                  }}
                />
              ) : existingImages.length === 0 ? (
                // ✅ 업로드 이미지도 없는 경우
                <p style={{
                  color: '#aaa',
                  paddingTop: '50%',
                  transform: 'translateY(-50%)'
                }}>이미지 없음</p>
              ) : (
                // ✅ 업로드 이미지가 있는 경우
                existingImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={`/diary/storage/${encodeURIComponent(img)}`}
                    alt={`이미지 ${idx + 1}`}
                    style={{
                      width: idx === 0 ? '210px' : '100px',
                      height: idx === 0 ? '210px' : '100px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      margin: '5px'
                    }}
                  />
                ))
              )}
            </div>
          )}

        </div>

        {/* 오른쪽 - 내용 영역 */}
        <div style={{
          flex: 1.75,
          paddingLeft: '20px',
          position: 'relative',
          minHeight: '400px'
        }}>
          {/* 상단 헤더: 제목 + 닫기버튼 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: '#333'
            }}>
              {isReadMode
                ? '📖 일기 보기'
                : (createMode ? '✏️ 새 일기 작성' : '✏️ 수정 모드')}
            </h3>
            <button
              onClick={onClose}
              onMouseEnter={() => setIsCloseHovered(true)}
              onMouseLeave={() => setIsCloseHovered(false)}
              style={{
                border: 'none',
                background: 'none',
                padding: 0,
                cursor: 'pointer'
              }}
            >
              <img
                src={isCloseHovered ? '/diary/images/close_cursor.png' : '/diary/images/close.png'}
                alt="닫기"
                style={{ width: '24px', height: '24px', display: 'block' }}
              />
            </button>
          </div>

                    {isReadMode ? (
            <>
              <h3 style={{ marginBottom: '5px', fontSize: '1rem', color: '#333', fontWeight: 'bold' }}>제목</h3>
              <div style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
                marginBottom: '10px',
                minHeight: '38px'
              }}>
                {diary?.title}
              </div>

              <h3 style={{ marginBottom: '5px', fontSize: '1rem', color: '#333', fontWeight: 'bold' }}>내용</h3>
              <div style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
                whiteSpace: 'pre-wrap',
                marginBottom: '20px',
                minHeight: '300px'
              }}>
                {diary?.content}
              </div>

              <p><strong>감정:</strong> {emotionObj.icon} {emotionObj.label}</p>
              <p><strong>날짜:</strong> {diary?.rdate}</p>

              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                display: 'flex',
                gap: '12px'
              }}>
                <button
                  onClick={handleEnterEditMode}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#d0f0c0',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >수정</button>
                <button
                  onClick={handleDelete}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f4cccc',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >삭제</button>
              </div>
            </>
          ) : (
            <>
              <h3 style={{ marginBottom: '5px', fontSize: '1rem', color: '#333', fontWeight: 'bold' }}>제목</h3>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="제목"
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9'
                }}
              />

              <h3 style={{ marginBottom: '5px', fontSize: '1rem', color: '#333', fontWeight: 'bold' }}>내용</h3>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="내용"
                rows={12}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '20px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9',
                  resize: 'vertical',
                  minHeight: '300px'
                }}
              />

              <div style={{ margin: '10px 0' }}>
                <strong>감정:</strong>
                <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
                  {emotionIcons.map(({ score, icon, label }) => (
                    <div
                      key={score}
                      onClick={() => setEditRiskFlag(score)}
                      title={label}
                      style={{
                        cursor: 'pointer',
                        fontSize: '1.8rem',
                        border: editRiskFlag === score ? '2px solid #0077cc' : '2px solid transparent',
                        borderRadius: '8px',
                        padding: '2px'
                      }}
                    >
                      {icon}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  onChange={handleAddImages}
                  style={{ margin: '10px 0' }}
                />
              </div>

              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                display: 'flex',
                gap: '12px'
              }}>
                {isEditMode && (
                  <button
                    onClick={handleToggleDefaultImage}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: isDefaultImage ? '#ffdddd' : '#cce5ff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {isDefaultImage ? '기본 이미지 취소' : '기본 이미지 설정'}
                  </button>
                )}
                <button
                  onClick={handleSaveUpdate}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#d0f0c0',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >저장</button>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#eee',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >취소</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

