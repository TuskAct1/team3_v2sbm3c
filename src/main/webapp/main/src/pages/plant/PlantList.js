import React, { useEffect, useState } from 'react';
import { fetchPlants } from '../../api/plantApi';

const PlantList = ({ memberno }) => {
  const [plants, setPlants] = useState([]);

  const loadPlants = async () => {
    try {
      const data = await fetchPlants(memberno);
      setPlants(data);
    } catch (err) {
      console.error('조회 실패', err);
    }
  };

  useEffect(() => {
    loadPlants();
  }, [memberno]);

  return (
    <div>
      <h2>내 식물 목록</h2>
      {plants.length === 0 ? (
        <p>식물이 없습니다.</p>
      ) : (
        <ul>
          {plants.map((plant) => (
            <li key={plant.plantno}>
              🌱 이름: {plant.plant_name} / 종류: {plant.plant_type} / 성장률: {plant.growth}%
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlantList;
