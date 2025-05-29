import React from "react";

export const Card = ({ card, onClick }) => {
  const { flipped, matched, emoji } = card;

  return (
    <div className="card-container" onClick={() => onClick(card)}>
      <div className={`card-inner ${flipped || matched ? "flipped" : ""}`}>
        <div className="card-front">❓</div>
        <div className="card-back">{emoji}</div>
      </div>
    </div>
  );
};
