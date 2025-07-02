import React, { useState } from 'react';
import { createPlant } from '../../api/plantApi';

const PlantCreate = ({ memberno, onPlantCreated }) => {
  const [plantName, setPlantName] = useState('');
  const [plantType, setPlantType] = useState('딸기');

  const handleSubmit = async () => {
    try {
      await createPlant({
        memberno,
        plant_name: plantName,
        plant_type: plantType
      });
      alert('식물이 생성되었습니다!');
      setPlantName('');
      if (onPlantCreated) onPlantCreated(); // 목록 새로고침
    } catch (err) {
      alert('생성 실패');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>반려식물 생성</h2>
      <input
        value={plantName}
        onChange={(e) => setPlantName(e.target.value)}
        placeholder="식물 이름"
      />
      <select value={plantType} onChange={(e) => setPlantType(e.target.value)}>
        <option value="딸기">딸기</option>
        <option value="토마토">토마토</option>
      </select>
      <button onClick={handleSubmit}>등록</button>
    </div>
  );
};

export default PlantCreate;
