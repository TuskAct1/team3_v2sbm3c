import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RewardApply = ({ memberno }) => {
  const [sticker, setSticker] = useState(0);
  const [form, setForm] = useState({
    fruit_type: '딸기',
    receiver_name: '',
    receiver_phone: '',
    zipcode: '',
    address1: '',
    address2: ''
  });

  useEffect(() => {
    axios.get(`http://121.78.128.139:9093/api/members/${memberno}`)
      .then(res => setSticker(res.data.sticker))
      .catch(() => alert("스티커 조회 실패"));
  }, [memberno]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    if (sticker < 10) return alert('스티커가 10개 이상 있어야 신청이 가능합니다.');
    
    const payload = {
      ...form,
      memberno
    };

    try {
      const res = await axios.post('http://121.78.128.139:9093/api/reward/apply', payload);
      alert(res.data.message);
    } catch (err) {
      alert("신청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h2>🎁 실물 보상 신청</h2>
      <p>보유 스티커: {sticker}</p>
      <select name="fruit_type" onChange={onChange} value={form.fruit_type}>
        <option value="딸기">딸기</option>
        <option value="토마토">토마토</option>
      </select>
      <input name="receiver_name" placeholder="수령자 이름" onChange={onChange} />
      <input name="receiver_phone" placeholder="수령자 연락처" onChange={onChange} />
      <input name="zipcode" placeholder="우편번호" onChange={onChange} />
      <input name="address1" placeholder="주소1" onChange={onChange} />
      <input name="address2" placeholder="주소2" onChange={onChange} />
      <button onClick={onSubmit}>신청하기</button>
    </div>
  );
};

export default RewardApply;
