import axios from 'axios';
import React, { useEffect, useState } from 'react';

const HarvestButton = ({ plantno, memberno }) => {
  const [growth, setGrowth] = useState(0);

  useEffect(() => {
    axios.get(`http://121.78.128.139:9093/api/plants/read?plantno=${plantno}`)
      .then(res => setGrowth(res.data.growth_percent));
  }, [plantno]);

  const handleHarvest = async () => {
    try {
      const res = await axios.post('http://121.78.128.139:9093/api/plants/harvest', null, {
        params: { plantno, memberno }
      });
      alert(res.data);
      setGrowth(0); // UI 갱신
    } catch (err) {
      alert('수확 실패');
    }
  };

  return (
    <>
      {growth >= 100 ? (
        <button onClick={handleHarvest}>🎉 수확하기 (스티커 +1)</button>
      ) : (
        <p>100%가 되면 수확할 수 있어요!</p>
      )}
    </>
  );
};

export default HarvestButton;
