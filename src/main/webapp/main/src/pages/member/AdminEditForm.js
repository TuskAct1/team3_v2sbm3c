import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminEditForm.css';

function AdminEditForm({ admin }) {
  const [form, setForm] = useState({
    id: '',
    email: '',
    name: '',
    tel: '',
    address: '',
    password: '', // 현재 비밀번호
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (admin) {
      setForm({
        id: admin.id || '',
        email: admin.email || '',
        name: admin.name || '',
        tel: admin.tel || '',
        address: admin.address || '',
        password: '',
      });
    }
  }, [admin]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setError('');

    if (!form.password) {
      setError('비밀번호를 입력해야 수정할 수 있습니다.');
      return;
    }

    try {
      const response = await axios.post('/api/admin/update-info', form);

      if (response.data === 'SUCCESS') {
        alert('관리자 정보가 성공적으로 수정되었습니다.');
        setForm(prev => ({ ...prev, password: '' }));
      } else {
        setError(response.data || '수정에 실패했습니다.');
      }
    } catch (err) {
      console.error('수정 실패', err);
      setError('서버 오류 발생');
    }
  };

  return (
    <div className="admin-edit-form">
      <h3>관리자 정보 수정</h3>

      <label>아이디</label>
      <input name="id" value={form.id} readOnly />

      <label>이름</label>
      <input name="name" value={form.name} onChange={handleChange} />

      <label style={{ marginTop: '16px' }}>🔐 현재 비밀번호</label>
      <input
        name="password"
        type="password"
        placeholder="정보 수정을 위해 비밀번호 입력"
        value={form.password}
        onChange={handleChange}
        required
      />

      {error && <div className="error-message">{error}</div>}

      <button className="save-btn" onClick={handleSubmit}>정보 수정</button>
    </div>
  );
}

export default AdminEditForm;
