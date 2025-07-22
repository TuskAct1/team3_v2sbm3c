import React from 'react';

const PlantTutorial = ({ onNext }) => {
  return (
    <div className="plant-tutorial">
      <img src="/images/tutorial.gif" alt="튜토리얼" />
      <p>
        하루에 한 번 물을 줄 수 있어요.<br />
        물을 줄 때마다 1원씩 생겨요!
      </p>
      <button onClick={onNext}>다음</button>
    </div>
  );
};

export default PlantTutorial;
