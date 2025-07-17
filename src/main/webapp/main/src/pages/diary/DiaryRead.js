import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";

const settings = {
  dots: true,
  adaptiveHeight: true,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: false,  // default 화살표 제거
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 3 },
    },
    {
      breakpoint: 768,
      settings: { slidesToShow: 2 },
    },
    {
      breakpoint: 480,
      settings: { slidesToShow: 1 },
    },
  ],
};

// 감정 아이콘/라벨 매핑
const emotions = [
  { score: 1, icon: "😃", label: "긍정" },
  { score: 2, icon: "😠", label: "부정" },
  { score: 3, icon: "😐", label: "중립" },
  { score: 4, icon: "😰", label: "불안" },
  { score: 5, icon: "😢", label: "우울" },
];

const DiaryRead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diary, setDiary] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const loggedInMemberno = user?.memberno;
  const sliderRef = useRef();

  useEffect(() => {
    if (!user?.memberno) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    axios.get(`/diary/read/${id}`)
      .then((res) => {
        if (res.data && res.data.memberno && res.data.memberno !== loggedInMemberno) {
          alert('권한이 없습니다.');
          navigate('/diary');
          return;
        }
        setDiary(res.data);
      })
      .catch(() => {
        alert('불러오기 실패');
        navigate('/diary');
      });
  }, [id, navigate, loggedInMemberno]);

  if (!diary) return <div>불러오는 중...</div>;

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      sliderRef.current?.slickNext();
    } else {
      sliderRef.current?.slickPrev();
    }
  };

  const fileList = diary.file1saved
    ? diary.file1saved.split(',').map(s => s.trim())
    : [];

  const emotion = emotions.find(e => e.score === diary.risk_flag);

  const showArrows = fileList.length > settings.slidesToShow;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <h2 style={{ marginBottom: '10px' }}>{diary.title}</h2>
      <p style={{ marginBottom: '20px' }}>
        <strong>날짜:</strong> {diary.rdate}
      </p>

      <div style={{ marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
        {diary.content}
      </div>

      {/* 이미지 섹션 */}
      {fileList.length > 0 && (
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '10px' }}>이미지</h3>
      
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            position: 'relative',
            padding: '10px 0',
          }}
        >
          {showArrows && (
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '2rem',
                color: '#0077cc',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              ◀
            </button>
          )}

          <div
            style={{
              flexGrow: 1,
              maxWidth: '700px',
              overflow: 'hidden',
            }}
            onWheel={handleWheel}
          >
            <Slider ref={sliderRef} {...settings}>
              {fileList.map((filename, idx) => (
                <div key={idx} style={{ padding: '0 5px' }}>
                  <img
                    src={`http://localhost:9093/diary/storage/${filename.trim()}`}
                    alt={`첨부 이미지 ${idx + 1}`}
                    style={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      cursor: 'pointer'
                    }}
                    onClick={() => setLightboxIndex(idx)}
                  />
                </div>
              ))}
            </Slider>
          </div>

          {showArrows && (
            <button
              onClick={() => sliderRef.current?.slickNext()}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '2rem',
                color: '#0077cc',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              ▶
            </button>
          )}
        </div>
      </div>
      )}

      {/* 감정 */}
      {emotion && (
        <div
          style={{
            marginTop: '30px',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <strong>오늘의 감정:</strong>
          <span style={{ fontSize: '1.5rem' }}>{emotion.icon}</span>
          {emotion.label}
        </div>
      )}

      {/* ✅ 수정/삭제 버튼 */}
      <div style={{
        marginTop: '30px',
        display: 'flex',
        justifyContent: 'center',
        gap: '20px'
      }}>
        <button
          onClick={() => navigate(`/diary/update/${id}`)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#d0f0c0',     // 연한 초록
            color: '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          수정
        </button>
        <button
          onClick={() => navigate('/diary')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#e0e0e0',     // 연한 회색
            color: '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          목록
        </button>
      </div>


      {/* 라이트박스 모달 */}
      {lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              flex: 1,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev > 0 ? prev - 1 : fileList.length - 1));
              }}
              style={{
                position: 'absolute',
                left: 20,
                fontSize: '2rem',
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              ◀
            </button>

            <div
              style={{
                width: '90vw',
                height: '80vh',
                backgroundImage: `url(http://localhost:9093/diary/storage/${fileList[lightboxIndex]})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: 'transparent'
              }}
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev < fileList.length - 1 ? prev + 1 : 0));
              }}
              style={{
                position: 'absolute',
                right: 20,
                fontSize: '2rem',
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              ▶
            </button>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              padding: '10px 20px',
              marginTop: '12px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderRadius: '8px'
            }}
          >
            {fileList.map((filename, idx) => (
              <img
                key={idx}
                src={`http://localhost:9093/diary/storage/${filename}`}
                alt={`썸네일 ${idx + 1}`}
                onClick={() => setLightboxIndex(idx)}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: 'cover',
                  borderRadius: 4,
                  border: idx === lightboxIndex ? '3px solid #0077cc' : '2px solid #ccc',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>

          <button
            onClick={() => setLightboxIndex(null)}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              fontSize: '2rem',
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>

  );
};

export default DiaryRead;
