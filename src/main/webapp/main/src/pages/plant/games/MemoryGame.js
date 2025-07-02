// src/pages/plant/games/MemoryGame.js
import React, { useState, useEffect } from "react";
import "./MemoryGame.css";

const items = ["🍓", "🍅", "🌽", "🍇", "🥕"];

const generateSequence = (length = 3) => {
  return Array.from({ length }, () => items[Math.floor(Math.random() * items.length)]);
};

const MemoryGame = ({ onComplete }) => {
  const [step, setStep] = useState(0); // 0: show, 1: input
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const newSeq = generateSequence(3);
    setSequence(newSeq);
    setStep(0);
    setUserInput([]);
    setMessage("");
    setTimeout(() => setStep(1), 3000);
  }, []);

  const handleInput = (item) => {
    const newInput = [...userInput, item];
    setUserInput(newInput);

    if (newInput.length === sequence.length) {
      if (newInput.join("") === sequence.join("")) {
        setMessage("🎉 정답이에요! 포인트 +5");
        onComplete(5);
      } else {
        setMessage("❌ 틀렸어요! 다음에 다시 도전해보세요.");
        onComplete(0);
      }
    }
  };

  return (
    <div className="memory-game-container">
      <h2>🧠 순서 기억 게임</h2>

      {step === 0 ? (
        <div className="sequence">
          {sequence.map((item, idx) => (
            <span key={idx}>{item}</span>
          ))}
        </div>
      ) : (
        <div className="choices">
          {items.map((item, idx) => (
            <button key={idx} onClick={() => handleInput(item)}>{item}</button>
          ))}
        </div>
      )}

      <p>{message}</p>
    </div>
  );
};

export default MemoryGame;
