import React, { useState } from 'react';
import { usePlantContext } from './PlantContext';

const NameForm = () => {
  const { plantType, setPlantName } = usePlantContext();
  const [nameInput, setNameInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (nameInput.trim() === '') {
      alert('이름을 입력해주세요!');
      return;
    }

    if (nameInput.length > 10) {
      alert('이름은 10자 이하로 입력해주세요.');
      return;
    }

    setPlantName(nameInput.trim());
  };

  const getPlantLabel = () => {
    if (plantType === 'sweet_potato') return '고구마';
    if (plantType === 'potato') return '감자';
    return '';
  };

  return (
    <div className="name-form-container" style={{ textAlign: 'center', padding: '40px' }}>
      <h2>당신의 {getPlantLabel()}에게 이름을 지어주세요!</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="이름 입력 (최대 10자)"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          maxLength={10}
          style={{
            padding: '10px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            width: '220px'
          }}
        />
        <br />
        <button
          type="submit"
          style={{
            marginTop: '16px',
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '8px',
            backgroundColor: '#57b6ac',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          이름 짓기 완료
        </button>
      </form>
    </div>
  );
};

export default NameForm;
