import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./DiaryPage.css";

const emotions = [
  { score: 1, icon: "😃", label: "긍정" },
  { score: 2, icon: "😠", label: "부정" },
  { score: 3, icon: "😐", label: "중립" },
  { score: 4, icon: "😰", label: "불안" },
  { score: 5, icon: "😢", label: "우울" },
];

function EmotionSelector({ selectedScore, onChange }) {
  return (
    <div className="EmotionSelector">
      {emotions.map(({ score, icon, label }) => (
        <div
          key={score}
          onClick={() => onChange(score)}
          title={label}
          className={`EmotionSelector-item ${selectedScore === score ? "active" : ""}`}
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
  const fileInputRef = useRef(null);

  const [state, setState] = useState({
    title: "",
    content: "",
    risk_flag: 3,
  });
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedExistingImages, setDeletedExistingImages] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const memberno = user?.memberno;

  // Fetch Diary on load
  useEffect(() => {
    if (!memberno) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const fetchDiary = async () => {
      try {
        const res = await axios.get(`/diary/read/${id}`);
        const data = res.data;

        if (!data || data.memberno !== memberno) {
          alert("권한이 없습니다!");
          navigate("/diary");
          return;
        }

        setState({
          title: data.title || "",
          content: data.content || "",
          risk_flag: data.risk_flag || 3,
        });

        if (data.file1saved) {
          const filesArray = data.file1saved.split(",").map(f => f.trim());
          setExistingImages(filesArray);
        }
      } catch (error) {
        console.error("일기 불러오기 실패:", error);
        alert("일기 데이터를 불러오지 못했습니다.");
        navigate("/diary");
      }
    };

    fetchDiary();
  }, [id, memberno, navigate]);

  // Handlers
  const handleChangeState = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      [name]: name === "risk_flag" ? Number(value) : value,
    }));
  };

  const handleQuillChange = (value) => {
    setState(prev => ({ ...prev, content: value }));
  };

  const handleEmotionChange = (score) => {
    setState(prev => ({ ...prev, risk_flag: score }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveImage = (index) => {
    setFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleRemoveExistingImage = (index) => {
    const toDelete = existingImages[index];
    setDeletedExistingImages(prev => [...prev, toDelete]);
    setExistingImages(prev => prev.filter((_, idx) => idx !== index));
  };

  // Combine existing, new, add-button
  const thumbnails = [
    ...existingImages.map((filename, idx) => ({
      type: "existing",
      src: `http://localhost:9093/diary/storage/${filename}`,
      index: idx
    })),
    ...files.map((file, idx) => ({
      type: "new",
      src: URL.createObjectURL(file),
      index: idx
    })),
  ];

  useEffect(() => {
    const totalPages = Math.ceil(thumbnails.length / 4);
    if (pageIndex >= totalPages) {
      setPageIndex(Math.max(0, totalPages - 1));
    }
  }, [thumbnails]);

  // Pagination - 4 per page
  const pagedThumbnails = [];
  for (let i = 0; i < thumbnails.length; i += 4) {
    pagedThumbnails.push(thumbnails.slice(i, i + 4));
  }
  const totalPages = pagedThumbnails.length;

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (state.title.trim().length < 1) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (state.content.trim().length < 5) {
      alert("내용은 최소 5자 이상 입력해주세요.");
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
    formData.append("risk_flag", String(state.risk_flag));
    formData.append("password", "1234");

    files.forEach(f => formData.append("files", f));
    deletedExistingImages.forEach(name => formData.append("deletedFiles", name));
    existingImages.forEach(name => {
      formData.append("remainFilesSaved", name);
      formData.append("remainFiles", name);
    });

    try {
      await axios.put(`/diary/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("일기 수정 성공!");
      navigate(`/diary/read/${id}`);
    } catch (error) {
      console.error(error);
      alert("일기 수정에 실패했습니다.");
    }
  };

    return (
    <div className="DiaryUpdate">
      <form onSubmit={handleSubmit}>
        <div className="DiaryUpdate-sectionTitle">제목</div>
        <input
          name="title"
          value={state.title}
          onChange={handleChangeState}
          placeholder="제목을 입력하세요"
          className="DiaryUpdate-input"
        />
        <div className="DiaryUpdate-sectionTitle">내용</div>
        <ReactQuill
          theme="snow"
          value={state.content}
          onChange={handleQuillChange}
          placeholder="내용을 입력하세요"
          style={{ height: "350px" }}
        />

        <div className="DiaryUpdate-section">
          <div className="DiaryUpdate-sectionTitle">사진 선택</div>
          
          <div className="DiaryUpdate-carouselContainer">
            <button
              type="button"
              onClick={() => setPageIndex(prev => Math.max(0, prev - 1))}
              disabled={pageIndex === 0}
              className="DiaryUpdate-carouselArrow left"
            >
              <span>{"<"}</span>
            </button>

            <div className="DiaryUpdate-carouselImages">
              {pagedThumbnails[pageIndex]?.map((item, idx) => (
                <div
                  key={idx}
                  className="DiaryUpdate-carouselImageCard"
                  onClick={() => {
                    if (item.type === "existing") handleRemoveExistingImage(item.index);
                    else if (item.type === "new") handleRemoveImage(item.index);
                  }}
                >
                  <img src={item.src} alt="" />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setPageIndex(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={pageIndex >= totalPages - 1}
              className="DiaryUpdate-carouselArrow right"
            >
              <span>{">"}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="DiaryUpdate-addImageButton"
          >
            + 이미지 추가
          </button>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: "none" }}
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </div>

        <div>
          <span>오늘의 감정점수 : </span>
          <EmotionSelector selectedScore={state.risk_flag} onChange={handleEmotionChange} />
        </div>

        <div className="DiaryUpdate-buttons">
          <button type="submit" className="DiaryUpdate-button save">
            저장
          </button>
          <button
            type="button"
            onClick={() => navigate(`/diary/read/${id}`)}
            className="DiaryUpdate-button back"
          >
            뒤로가기
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiaryUpdate;
