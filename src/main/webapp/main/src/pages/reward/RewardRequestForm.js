import React, { useEffect, useState } from "react";
import axios from "axios";
import DaumPostcode from "../components/DaumPostcode";

const RewardRequestForm = ({ memberno }) => {
  const [form, setForm] = useState({
    fruit_type: "",
    receiver_name: "",
    receiver_phone: "",
    zipcode: "",
    address1: "",
    address2: "",
  });

  const [showPostcode, setShowPostcode] = useState(false);
  const [sticker, setSticker] = useState(0); // ✅ 스티커 개수 상태
  const [loading, setLoading] = useState(true);

  // 🍓 로그인한 회원의 식물 종류 및 스티커 개수 가져오기
  useEffect(() => {
    if (!memberno) return;

    const fetchData = async () => {
      try {
        const [plantRes, memberRes] = await Promise.all([
          axios.get(`http://121.78.128.139:9093/api/plants/member`, { params: { memberno } }),
          axios.get(`http://121.78.128.139:9093/api/members/${memberno}`),
        ]);

        const plant = plantRes.data;
        const member = memberRes.data;

        if (plant?.plant_type) {
          setForm((prev) => ({ ...prev, fruit_type: plant.plant_type }));
        }

        if (member?.sticker != null) {
          setSticker(member.sticker);
        }

        setLoading(false);
      } catch (error) {
        console.error("정보 조회 실패:", error);
      }
    };

    fetchData();
  }, [memberno]);

  const handleAddressSelect = (data) => {
    setForm({
      ...form,
      zipcode: data.zonecode,
      address1: data.address,
    });
    setShowPostcode(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (sticker < 10) {
      alert("스티커가 부족하여 보상을 신청할 수 없습니다.");
      return;
    }

    axios
      .post("http://121.78.128.139:9093/api/reward/create", { ...form, memberno })
      .then((res) => {
        if (res.data.success) {
          alert("보상 신청 완료!");
        } else {
          alert("신청 실패. 다시 시도해주세요.");
        }
      })
      .catch(() => {
        alert("서버 오류로 신청 실패");
      });
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
      <h2>보상 신청</h2>

      <p><strong>현재 보유 스티커:</strong> {sticker}개</p>
      {sticker < 10 && (
        <p style={{ color: "red" }}>스티커가 10개 이상일 때만 신청 가능합니다.</p>
      )}

      <label>과일 종류 (키운 식물)</label>
      <input name="fruit_type" value={form.fruit_type} readOnly style={{ backgroundColor: "#eee" }} />

      <label>수령인 이름</label>
      <input name="receiver_name" value={form.receiver_name} onChange={handleChange} required />

      <label>수령인 전화번호</label>
      <input name="receiver_phone" value={form.receiver_phone} onChange={handleChange} required />

      <label>우편번호</label>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input name="zipcode" value={form.zipcode} onChange={handleChange} required readOnly />
        <button type="button" onClick={() => setShowPostcode(true)} style={{ marginLeft: "10px" }}>
          주소 찾기
        </button>
      </div>

      <label>주소</label>
      <input name="address1" value={form.address1} onChange={handleChange} required readOnly />
      <input name="address2" value={form.address2} onChange={handleChange} required placeholder="상세주소" />

      {showPostcode && <DaumPostcode onComplete={handleAddressSelect} />}

      <button type="submit" style={{ marginTop: "20px" }} disabled={sticker < 10}>
        신청하기
      </button>
    </form>
  );
};

export default RewardRequestForm;
