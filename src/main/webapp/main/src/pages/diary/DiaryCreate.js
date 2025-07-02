import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 감정 아이콘과 점수 매핑
const emotions = [
  { score: 1, icon: "😄", label: "아주 좋음" },
  { score: 2, icon: "🙂", label: "좋음" },
  { score: 3, icon: "😐", label: "보통" },
  { score: 4, icon: "🙁", label: "나쁨" },
  { score: 5, icon: "😞", label: "아주 나쁨" },
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
    risk_flag: 3, // 기본 중간값으로 설정
  });

  const titleInput = useRef();
  const contentInput = useRef();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const memberno = user?.memberno;

  const handleChangeState = (e) => {
    setState({
      ...state,
      [e.target.name]:
        e.target.name === "risk_flag" ? Number(e.target.value) : e.target.value,
    });
  };

  // 감정 점수 직접 변경 함수
  const handleEmotionChange = (score) => {
    setState((prev) => ({ ...prev, risk_flag: score }));
  };

  const handleSubmit = async () => {
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

    const user = JSON.parse(localStorage.getItem("user"));
    const memberno = user?.memberno;

    if (!memberno) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      await axios.post("/diary/create", {
        memberno,
        title: state.title,
        content: state.content,
        risk_flag: state.risk_flag,
        password: "1234",
      });
      alert("일기 저장 성공!");
      navigate("/diary");
    } catch (error) {
      console.error(error);
      alert("일기 저장에 실패했습니다.");
    }
  };

  return (
    <div className="DiaryCreate" style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>오늘의 일기</h2>
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
      <div>
        <span>오늘의 감정점수 : </span>
        <EmotionSelector selectedScore={state.risk_flag} onChange={handleEmotionChange} />
      </div>
      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
  <button
    onClick={handleSubmit}
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
    저장하기
  </button>
  <button
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
    뒤로가기
  </button>
</div>

    </div>
  );
};

export default DiaryCreate;
