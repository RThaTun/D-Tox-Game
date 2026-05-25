import React from 'react';

export default function ScoreBoard({ players, maxHP }) {
  return (
    <div className="scoreboard">
      {players.map((p, i) => (
        <div key={i} className={`player-score ${p.isActive ? 'active' : ''}`}>
          <div className="player-label">{p.label}</div>
          <div className="hp-bar-container">
            <div
              className="hp-bar"
              style={{ width: `${Math.max(0, (p.hp / maxHP) * 100)}%` }}
            />
          </div>
          <div className="hp-text">{p.hp} / {maxHP} HP</div>
        </div>
      ))}
    </div>
  );
}