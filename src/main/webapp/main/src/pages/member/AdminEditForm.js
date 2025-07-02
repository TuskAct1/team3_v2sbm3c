import React, { useState } from 'react';
import axios from 'axios';

function AdminEditForm({ initialData, onCancel, onUpdated }) {
  const [form, setForm] = useState({ ...initialData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/api/admin/update`, form)
      .then(() => {
        onUpdated(form);
      })
      .catch(() => {
        alert("수정 실패");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>이름:</label>
        <input name="name" value={form.name} onChange={handleChange} />
      </div>
      <div>
        <label>이메일:</label>
        <input name="email" value={form.email} onChange={handleChange} readOnly />
      </div>
      <div style={{ marginTop: "10px" }}>
        <button type="submit">저장</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>취소</button>
      </div>
    </form>
  );
}

export default AdminEditForm;
