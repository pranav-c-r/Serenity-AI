import React, { useState, useEffect, useRef } from 'react';
import './CreativeExpression.scss';

const getRandomPrompt = () => {
  const prompts = [
    "Draw your current emotion as an abstract shape.",
    "Create a pattern with only circles and lines.",
    "Design a scene that represents calmness.",
    "Use only 3 colors to depict your favorite memory.",
    "Make a creature that doesn’t exist.",
    "Illustrate what ‘freedom’ feels like.",
    "Turn a random squiggle into a piece of art."
  ];
  return prompts[Math.floor(Math.random() * prompts.length)];
};

export default function CreativeExpression() {
  const canvasRef = useRef(null); // 🔼 moved above useEffect
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
  }, []);

  const [prompt, setPrompt] = useState(getRandomPrompt());

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    isDrawing.current = true;
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const newPrompt = () => {
    let nextPrompt = getRandomPrompt();
    while (nextPrompt === prompt) {
      nextPrompt = getRandomPrompt(); // avoid same prompt twice
    }
    setPrompt(nextPrompt);
  };

  useEffect(() => {
    const promptEl = document.querySelector('.prompt-text');
    if (promptEl) {
      promptEl.classList.remove('fade-in');
      void promptEl.offsetWidth; // trigger reflow
      promptEl.classList.add('fade-in');
    }
  }, [prompt]);

  return (
    <div className="creative-expression">
      <h1>Creative Expression</h1>
      <p className="tagline">Express yourself through interactive art challenges</p>
      <div className="challenge-box">
        <div className="prompt-text">{prompt}</div>
        <canvas
          ref={canvasRef} // 🔼 added ref here
          width={600}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <button onClick={handleClearCanvas}>Clear</button>
        <button onClick={newPrompt}>New Challenge</button>
      </div>
    </div>
  );
}
