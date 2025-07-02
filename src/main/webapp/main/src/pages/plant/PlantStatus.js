import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlantStatus = ({ plantno }) => {
  const [plant, setPlant] = useState(null);

  useEffect(() => {
    axios.get(`/api/plants/read?plantno=${plantno}`)
      .then(res => setPlant(res.data))
      .catch(err => console.error('식물 조회 실패:', err));
  }, [plantno]);

  return (
    <div>
      <h3>{plant?.plant_name}의 성장 상태</h3>
      <div style={{ border: '1px solid #ccc', width: '300px', height: '30px', borderRadius: '10px' }}>
        <div style={{
          width: `${plant?.growth_percent}%`,
          height: '100%',
          backgroundColor: '#57b6ac',
          borderRadius: '10px'
        }} />
      </div>
      <p>{plant?.growth_percent}% 성장</p>
    </div>
  );
};

export default PlantStatus;
