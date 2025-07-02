import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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

const DiaryUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState({
    title: "",
    content: "",
    risk_flag: 3,
  });

  const titleInput = useRef();
  const contentInput = useRef();

  // ✅ 로그인 사용자 정보 가져오기
  const user = JSON.parse(localStorage.getItem("user"));
  const memberno = user?.memberno;

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const res = await axios.get(`/diary/read/${id}`);
        const data = res.data;
        // OPTIONAL: 본인 글인지 체크
        if (data.memberno !== memberno) {
          alert("권한이 없습니다!");
          navigate("/diary");
          return;
        }
        setState({
          title: data.title || "",
          content: data.content || "",
          risk_flag: data.risk_flag || 3,
        });
      } catch (error) {
        console.error("일기 불러오기 실패:", error);
        alert("일기 데이터를 불러오지 못했습니다.");
      }
    };

    fetchDiary();
  }, [id, memberno, navigate]);

  const handleChangeState = (e) => {
  const { name, value } = e.target;
  setState({
    ...state,
    [name]: name === "risk_flag" ? Number(value) : value,
  });
};

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

    try {
      await axios.put(`/diary/update/${id}`, {
        memberno,                       // ✅ 추가
        title: state.title,
        content: state.content,
        risk_flag: state.risk_flag,
        password: "1234",
      });
      alert("일기 수정 성공!");
      navigate("/diary");
    } catch (error) {
      console.error(error);
      alert("일기 수정에 실패했습니다.");
    }
  };

  return (
    <div className="DiaryUpdate" style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>일기 수정</h2>
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
      <div style={{ marginTop: 20 }}>
        <button onClick={handleSubmit} style={{ padding: "10px 20px", fontSize: 16 }}>
          수정하기
        </button>
      </div>
    </div>
  );
};

export default DiaryUpdate;
