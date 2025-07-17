import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";

const emotions = [
  { score: 1, icon: "😃", label: "긍정" },
  { score: 2, icon: "😠", label: "부정" },
  { score: 3, icon: "😐", label: "중립" },
  { score: 4, icon: "😰", label: "불안" },
  { score: 5, icon: "😢", label: "우울" },
];

const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
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

function EmotionSelector({ selectedScore, onChange }) {
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
      {emotions.map(({ score, icon, label }) => (
        <div
          key={score}
          onClick={() => onChange(score)}
          title={label}
          style={{
            cursor: "pointer",
            fontSize: "2rem",
            userSelect: "none",
            transition: "transform 0.2s",
            transform: selectedScore === score ? "scale(1.3)" : "scale(1)",
            filter: selectedScore === score ? "none" : "grayscale(70%)",
            border: selectedScore === score ? "2px solid #0077cc" : "2px solid transparent",
            borderRadius: "8px",
            padding: "4px",
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onChange(score);
          }}
          aria-label={label}
        >
          {icon}
        </div>
      ))}
    </div>
  );
}

const DiaryCreate = () => {
  const [state, setState] = useState({
    title: "",
    content: "",
    risk_flag: 3,
  });

  const [files, setFiles] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(null);

  const titleInput = useRef();
  const contentInput = useRef();
  const fileInputRef = useRef();
  const sliderRef = useRef();

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const memberno = user?.memberno;

  // Wheel 지원
  useEffect(() => {
    if (!sliderRef.current) return;

    const track = sliderRef.current.innerSlider?.list;
    if (!track) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY > 0) {
        sliderRef.current?.slickNext();
      } else {
        sliderRef.current?.slickPrev();
      }
    };

    track.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      track.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useEffect(() => {
    if (!memberno) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [navigate, memberno]);

  const handleChangeState = (e) => {
    setState({
      ...state,
      [e.target.name]:
        e.target.name === "risk_flag" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleEmotionChange = (score) => {
    setState((prev) => ({ ...prev, risk_flag: score }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveImage = (index) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (state.title.length < 1) {
      alert("제목을 입력해주세요.");
      titleInput.current.focus();
      return;
    }
    if (state.content.length < 5) {
      alert("내용은 최소 5자 이상 입력해주세요.");
      contentInput.current.focus();
      return;
    }

    if (!memberno) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("memberno", memberno);
    formData.append("title", state.title);
    formData.append("content", state.content);
    formData.append("password", "1234");
    formData.append("risk_flag", state.risk_flag);
    files.forEach((f) => {
      formData.append("files", f);
    });

    try {
      await axios.post("/diary/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("일기 저장 성공!");
      navigate("/diary");
    } catch (error) {
      console.error(error);
      alert("일기 저장 실패!");
    }
  };

  const allThumbnails = [
    ...files.map((file, idx) => ({
      type: 'new',
      src: URL.createObjectURL(file),
      index: idx
    })),
    { type: 'addButton' }
  ];

  return (
    <div className="DiaryCreate" style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>오늘의 일기</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <input
            ref={titleInput}
            name="title"
            value={state.title}
            onChange={handleChangeState}
            placeholder="제목을 입력하세요"
            style={{ width: "100%", padding: 8, fontSize: 16 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <textarea
            ref={contentInput}
            name="content"
            value={state.content}
            onChange={handleChangeState}
            placeholder="내용을 입력하세요"
            rows={6}
            style={{ width: "100%", padding: 8, fontSize: 16, resize: "vertical" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <strong style={{ fontSize: '1.1rem' }}>이미지 선택</strong>
          <div style={{ marginTop: 8 }}>
            <Slider ref={sliderRef} {...sliderSettings}>
              {allThumbnails.map((item, idx) => {
                if (item.type === 'new') {
                  return (
                    <div key={`new-${item.index}`}>
                      <div
                        style={{
                          position: 'relative',
                          width: '100px',
                          height: '100px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          margin: 'auto',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleRemoveImage(item.index)}
                        onMouseEnter={() => setHoverIndex(item.index)}
                        onMouseLeave={() => setHoverIndex(null)}
                      >
                        <img
                          src={item.src}
                          alt=""
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            opacity: hoverIndex === item.index ? 1 : 0,
                            transition: 'opacity 0.2s'
                          }}
                        >
                          -
                        </div>
                      </div>
                    </div>
                  );
                }
                if (item.type === 'addButton') {
                  return (
                    <div key="add-button">
                      <div
                        onClick={() => fileInputRef.current.click()}
                        style={{
                          width: '100px',
                          height: '100px',
                          border: '2px dashed #0077cc',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                          color: '#0077cc',
                          margin: 'auto'
                        }}
                      >
                        +
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </Slider>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div>
          <span>오늘의 감정점수 : </span>
          <EmotionSelector selectedScore={state.risk_flag} onChange={handleEmotionChange} />
        </div>

        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "10px 20px",
              fontSize: 16,
              backgroundColor: "#0077cc",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            저장
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              flex: 1,
              padding: "10px 20px",
              fontSize: 16,
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            목록
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiaryCreate;
