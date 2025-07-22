import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const emotions = [
  { score: 1, icon: "😃", label: "긍정" },
  { score: 2, icon: "😠", label: "부정" },
  { score: 3, icon: "😐", label: "중립" },
  { score: 4, icon: "😰", label: "불안" },
  { score: 5, icon: "😢", label: "우울" },
];

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

  const [images, setImages] = useState([null, null, null, null]);
  const [defaultImageUsed, setDefaultImageUsed] = useState(false);

  const titleInput = useRef();
  const contentInput = useRef();
  const fileInputRefs = useRef([React.createRef(), React.createRef(), React.createRef(), React.createRef()]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const memberno = user?.memberno;

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

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...images];
      updatedImages[index] = file;
      setImages(updatedImages);
      setDefaultImageUsed(false);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages[index] = null;
    setImages(updatedImages);
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
    images.forEach((file) => {
      if (file) formData.append("files", file);
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

  const handleUseDefaultImage = () => {
    setDefaultImageUsed(true);
  };

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
          <strong>이미지 선택 (최대 4개)</strong>
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            {images.map((img, idx) => (
              <div key={idx} style={{ position: "relative" }}>
                <div onClick={() => fileInputRefs.current[idx].current.click()} style={{
                  width: 80,
                  height: 80,
                  border: "2px dashed #0077cc",
                  borderRadius: 8,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}>
                  {img ? (
                    <img src={URL.createObjectURL(img)} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: 24, color: "#0077cc" }}>+</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRefs.current[idx]}
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e, idx)}
                  />
                </div>
                {img && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      background: "#ff5c5c",
                      border: "none",
                      borderRadius: "50%",
                      color: "#fff",
                      width: 20,
                      height: 20,
                      fontSize: 12,
                      cursor: "pointer"
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {images.every(img => img === null) && !defaultImageUsed && (
          <button type="button" onClick={handleUseDefaultImage} style={{ marginTop: 10 }}>
            기본 이미지 사용
          </button>
        )}

        {defaultImageUsed && (
          <div style={{ marginTop: 16 }}>
            <img src="/images/default_nature.jpg" alt="기본 이미지" style={{ width: "100%", borderRadius: 12 }} />
          </div>
        )}

        <div style={{ marginTop: 20 }}>
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
