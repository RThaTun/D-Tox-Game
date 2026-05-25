import React, { useEffect, useState } from 'react';
import Card from './Card';
import ScoreBoard from './ScoreBoard';
import GameOverModal from './GameOverModal';
import { useGame } from '../hooks/useGame';
import '../index.css';

export default function SinglePlayer() {
  const { gameState, selected, log, gameOver, status, initGame, toggleCard, playCards } = useGame();
  const [preview, setPreview] = useState(null);

  useEffect(() => { initGame(); }, []);

  if (!gameState) {
    return <div className="loading-screen"><div className="loading-dot">✦</div></div>;
  }

  const { playerHand, aiHand, deck, lastPlayed, playerHP, aiHP, turn } = gameState;
  const isMyTurn = turn === 'player';
  const canPlay = selected.length > 0 && isMyTurn;

  return (
    <div className="page-game">

      <ScoreBoard
        players={[
          { label: 'You', hp: playerHP, isActive: isMyTurn },
          { label: 'AI 🤖', hp: aiHP, isActive: !isMyTurn },
        ]}
        maxHP={20}
      />

      <div className="status-bar">{status}</div>

      {/* AI hand face-down */}
      <div>
        <div className="section-label">AI's Hand</div>
        <div className="hand-row">
          {aiHand.map((_, i) => (
            <div key={i} className="card-back">✦</div>
          ))}
        </div>
      </div>

      {/* Deck + last played */}
      <div className="center-row">
        <div>
          <div className="pile-label">Deck</div>
          <div className="deck-pile">
            <div className="deck-num">{deck.length}</div>
            <div className="deck-txt">cards</div>
          </div>
        </div>
        <div>
          <div className="pile-label">Last Played</div>
          <div className="last-played">
            {lastPlayed
              ? <img src={require(`../images/detox${lastPlayed.id}.png`)} alt="" />
              : <span className="last-played-empty">—</span>}
          </div>
        </div>
      </div>

      {/* Your hand */}
      <div>
        <div className="section-label section-label-blue">Your Hand</div>
        <div className="hand-row">
          {playerHand.map((card, idx) => (
            <Card
              key={idx}
              card={card}
              selected={selected.includes(idx)}
              disabled={!isMyTurn}
              onClick={() => toggleCard(idx)}
              onMouseEnter={setPreview}
              onMouseLeave={() => setPreview(null)}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      {isMyTurn && (
        <div className="action-panel">
          <div className="action-hint">
            {selected.length === 0
              ? 'Select 1 double-trait or up to 2 single-trait cards'
              : `${selected.length} card${selected.length > 1 ? 's' : ''} selected — play on:`}
          </div>
          <div className="action-row">
            <button className="btn-action blue" disabled={!canPlay} onClick={() => playCards('self')}>
              ✦ Myself
            </button>
            <button className="btn-action pink" disabled={!canPlay} onClick={() => playCards('opponent')}>
              ✦ AI
            </button>
          </div>
        </div>
      )}

      {/* Log */}
      {log.length > 0 && (
        <div className="game-log">
          {log.map((l, i) => <div key={i} className="log-line">{l}</div>)}
        </div>
      )}

      {/* Card preview on hover */}
      {preview && (
        <div className="card-preview">
          <img src={require(`../images/detox${preview.id}.png`)} alt={preview.name} />
          <div className="preview-name">{preview.name}</div>
          <div className="preview-desc">{preview.desc}</div>
        </div>
      )}

      {/* Game over modal */}
      {gameOver && (
        <GameOverModal
          winner={gameOver.winner}
          players={[
            { displayName: 'You', hp: gameOver.playerHP },
            { displayName: 'AI', hp: gameOver.aiHP }
          ]}
          onPlayAgain={initGame}
        />
      )}
    </div>
  );
}