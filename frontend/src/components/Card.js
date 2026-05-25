import React from 'react';

export default function Card({ card, selected, disabled, onClick, onMouseEnter, onMouseLeave }) {
  return (
    <div
      className={`card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''} ${card.type === 'double' ? 'double' : ''}`}
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => onMouseEnter && onMouseEnter(card)}
      onMouseLeave={() => onMouseLeave && onMouseLeave()}
    >
      <img src={require(`../images/detox${card.id}.png`)} alt={card.name} />
      <div className="card-name">{card.name}</div>
      <div className="card-value">
        {card.values.map((v, i) => (
          <span key={i} className={v > 0 ? 'positive' : 'negative'}>
            {v > 0 ? '+' : ''}{v}
          </span>
        ))}
      </div>
    </div>
  );
}