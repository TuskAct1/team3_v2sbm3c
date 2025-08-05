import React, { useState } from "react";
import axios from "axios";

const FindPasswordModal = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await axios.post("http://121.78.128.139:9093/api/members/find-password", { id: email });
      setMsg(res.data.msg || "메일을 확인해주세요.");
    } catch (err) {
      setMsg("서버 오류입니다. 다시 시도해주세요.");
    }
    setLoading(false);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>비밀번호 찾기</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="가입한 이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "90%" }}
          />
          <button type="submit" disabled={loading} style={{ margin: "10px 0" }}>
            {loading ? "전송 중..." : "임시 비밀번호 받기"}
          </button>
          <button type="button" onClick={onClose} style={{ marginLeft: "12px" }}>
            닫기
          </button>
        </form>
        {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
      </div>
      {/* 간단한 스타일, 실제 앱에서는 모달 CSS 사용 추천 */}
      <style>{`
        .modal-backdrop {
          position: fixed; left:0; top:0; right:0; bottom:0; background: rgba(0,0,0,0.2); z-index: 1000;
          display: flex; align-items: center; justify-content: center;
        }
        .modal-content {
          background: #fff; border-radius: 10px; padding: 30px 32px; box-shadow: 0 2px 16px #0001; min-width: 320px;
        }
      `}</style>
    </div>
  );
};

export default FindPasswordModal;
