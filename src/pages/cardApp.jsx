import React, { useEffect, useState } from "react";
import { Card } from "./Card";
import './CardApp.scss';

const emojis = ["🌸", "🌼", "🌿", "🌈", "🌙", "🦋", "🌻", "💫"];
const shuffledCards = () => {
  const pair = [...emojis, ...emojis]
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({
      id: index,
      emoji,
      flipped: false,
      matched: false,
    }));
  return pair;
};

function CardApp() {
  const [cards, setCards] = useState(shuffledCards());
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (firstCard && secondCard) {
      setDisabled(true);
      if (firstCard.emoji === secondCard.emoji) {
        setCards(prev =>
          prev.map(card =>
            card.emoji === firstCard.emoji ? { ...card, matched: true } : card
          )
        );
        resetTurn();
      } else {
        setTimeout(() => {
          setCards(prev =>
            prev.map(card =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, flipped: false }
                : card
            )
          );
          resetTurn();
        }, 800);
      }
    }
  }, [firstCard, secondCard]);

  const handleClick = (card) => {
    if (disabled || card.flipped || card.matched) return;
    setCards(prev =>
      prev.map(c =>
        c.id === card.id ? { ...c, flipped: true } : c
      )
    );
    if (!firstCard) setFirstCard(card);
    else setSecondCard(card);
  };

  const resetTurn = () => {
    setFirstCard(null);
    setSecondCard(null);
    setMoves(m => m + 1);
    setDisabled(false);
  };

  const restartGame = () => {
    setCards(shuffledCards());
    setFirstCard(null);
    setSecondCard(null);
    setMoves(0);
    setDisabled(false);
  };

  const allMatched = cards.every(c => c.matched);

  return (
    <div className="card-app">
      <h1>Serena's Memory Match</h1>
      <p>Find all the peaceful pairs 🌼</p>

      <div className="card-grid">
        {cards.map(card => (
          <Card key={card.id} card={card} onClick={handleClick} />
        ))}
      </div>

      <div className="info">
        <p>Moves: {moves}</p>
        {allMatched && <p className="success">Well done! 🌟</p>}
        <button onClick={restartGame}>Restart Game</button>
      </div>
    </div>
  );
}

export default CardApp;
