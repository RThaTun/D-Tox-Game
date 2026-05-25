import React from 'react';

export default function GameOverModal({ winner, players, onPlayAgain }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-title">
          {winner === 'Tie' ? "It's a Tie!" : `${winner} Wins! 🎉`}
        </div>
        <div className="modal-scores">
          {players.map((p, i) => (
            <div key={i} className="modal-score-row">
              <span>{p.displayName}</span>
              <span>{p.hp} HP</span>
            </div>
          ))}
        </div>
        <button className="btn-action blue" onClick={onPlayAgain}>
          Play Again ✦
        </button>
      </div>
    </div>
  );
}