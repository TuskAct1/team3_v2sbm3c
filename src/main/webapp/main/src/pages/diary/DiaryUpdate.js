import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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

const DiaryUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState({
    title: "",
    content: "",
    risk_flag: 3,
    file1MF: null,
    file1saved: "",
  });

  const [newPreview, setNewPreview] = useState(null);

  const titleInput = useRef();
  const contentInput = useRef();

  const user = JSON.parse(localStorage.getItem("user"));
  const memberno = user?.memberno;

  useEffect(() => {
    if (!memberno) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [navigate, memberno]);

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const res = await axios.get(`/diary/read/${id}`);
        const data = res.data;

        if (!data || data.memberno !== memberno) {
          alert("권한이 없습니다!");
          navigate("/diary");
          return;
        }

        setState((prev) => ({
          ...prev,
          title: data.title || "",
          content: data.content || "",
          risk_flag: data.risk_flag || 3,
          file1saved: data.file1saved || "",
        }));
      } catch (error) {
        console.error("일기 불러오기 실패:", error);
        alert("일기 데이터를 불러오지 못했습니다.");
        navigate("/diary");
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setState({
      ...state,
      file1MF: file,
    });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setNewPreview(null);
    }
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
      const formData = new FormData();
      formData.append("memberno", memberno);
      formData.append("title", state.title);
      formData.append("content", state.content);
      formData.append("risk_flag", String(state.risk_flag));
      formData.append("password", "1234");

      if (state.file1MF) {
        formData.append("file1MF", state.file1MF);
      }

      await axios.put(`/diary/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
      <div style={{ marginBottom: 12 }}>
        <label>첨부 이미지:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      {newPreview ? (
        <div style={{ marginTop: 12 }}>
          <p>선택한 새 이미지 미리보기:</p>
          <img
            src={newPreview}
            alt="새 이미지 미리보기"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      ) : state.file1saved ? (
        <div style={{ marginTop: 12 }}>
          <p>현재 등록된 이미지:</p>
          <img
            src={`http://localhost:9093/diary/storage/${state.file1saved}`}
            alt="첨부 이미지"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      ) : null}
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
