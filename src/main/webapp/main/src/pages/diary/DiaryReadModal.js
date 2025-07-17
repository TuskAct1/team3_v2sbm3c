// DiaryReadModal.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
  const [newImages, setNewImages] = useState([]);
  const [sliderIndex, setSliderIndex] = useState(0);

  const fileInputRef = useRef();
  const sliderRef = useRef();

  const isReadMode = !createMode && !isEditMode;

  useEffect(() => {
    if (createMode) {
      setDiary({});
      setIsEditMode(true);
      setEditTitle('');
      setEditContent('');
      setEditRiskFlag(3);
      setExistingImages([]);
      setDeletedExistingImages([]);
      setNewImages([]);
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
  };
  const handleCancelEdit = () => {
    if (createMode) {
      onClose();
    } else {
      setIsEditMode(false);
      setSliderIndex(0);
      sliderRef.current?.slickGoTo(0);
    }
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
      onSuccess?.();
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
      newImages.forEach(file => formData.append('files', file));

      if (createMode) {
        formData.append('memberno', JSON.parse(localStorage.getItem("user")).memberno);
        const res = await axios.post('/diary/create', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('작성 완료!');
        onSuccess?.(res.data.id);
        onClose();
      } else {
        formData.append('memberno', diary.memberno);
        deletedExistingImages.forEach(name => formData.append('deletedFiles', name));
        existingImages.forEach(name => {
          formData.append('remainFilesSaved', name);
          formData.append('remainFiles', name);
        });
        await axios.put(`/diary/update/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('수정 완료!');
        setIsEditMode(false);
        onSuccess?.(id);
      }
    } catch (err) {
      console.error(err);
      alert('저장 실패');
    }
  };

  const allImagesForSlider = [
    ...existingImages.map((name, idx) => ({
      type: 'existing',
      src: `http://localhost:9093/diary/storage/${name}`,
      index: idx
    })),
    ...newImages.map((file, idx) => ({
      type: 'new',
      src: URL.createObjectURL(file),
      index: idx
    }))
  ];

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
          <div style={{ flex: '1 1 auto' }}>
            {allImagesForSlider.length > 0 ? (
              <Slider ref={sliderRef} {...sliderSettings} slickGoTo={sliderIndex}>
                {allImagesForSlider.map((item, idx) => (
                  <div key={idx}>
                    <img
                      src={item.src}
                      alt=""
                      style={{
                        width: '100%',
                        maxHeight: '400px',
                        objectFit: 'contain',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <p style={{ color: '#aaa', paddingTop: '50%', transform: 'translateY(-50%)' }}>이미지 없음</p>
            )}
          </div>
          {isEditMode && allImagesForSlider.length > 0 && (
            <div style={{
              marginTop: '12px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              justifyContent: 'center'
            }}>
              {allImagesForSlider.map((item, idx) => (
                <div key={idx} style={{
                  position: 'relative',
                  width: '120px',
                  height: '120px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <img
                    src={item.src}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <button
                    onClick={() =>
                      item.type === 'existing'
                        ? handleRemoveExistingImage(item.index)
                        : handleRemoveNewImage(item.index)
                    }
                    style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      background: 'rgba(255,255,255,0.8)',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >✕</button>
                </div>
              ))}
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

