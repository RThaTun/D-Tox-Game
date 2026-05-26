import { useState, useCallback, useRef } from 'react';
import CARD_DATA from '../CardData';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function calcEffect(cards) {
  return cards.reduce((sum, c) => sum + c.values.reduce((s, v) => s + v, 0), 0);
}

function aiChoosePlay(hand) {
  let best = null, bestScore = -Infinity;
  for (let i = 0; i < hand.length; i++) {
    const c = hand[i];
    if (c.type === 'double') {
      const eff = calcEffect([c]);
      const score = eff < 0 ? -eff * 2 : eff;
      if (score > bestScore) {
        bestScore = score;
        best = { indices: [i], target: eff < 0 ? 'opponent' : 'self' };
      }
    } else {
      for (let j = i; j < hand.length; j++) {
        if (j !== i && hand[j].type === 'double') continue;
        const cards = j === i ? [c] : [c, hand[j]];
        const eff = calcEffect(cards);
        const score = eff < 0 ? -eff * 2 : eff;
        if (score > bestScore) {
          bestScore = score;
          best = { indices: j === i ? [i] : [i, j], target: eff < 0 ? 'opponent' : 'self' };
        }
      }
    }
  }
  return best;
}

export function useGame() {
  const [gameState, setGameState] = useState(null);
  const [selected, setSelected] = useState([]);
  const [log, setLog] = useState([]);
  const [gameOver, setGameOver] = useState(null);
  const [status, setStatus] = useState('');
  const gameStateRef = useRef(null);

  const addLog = (msg) => setLog(prev => [msg, ...prev].slice(0, 8));

    const checkEnd = (state) => {
    if (state.playerHP <= 0) {
        setGameOver({ winner: 'AI', playerHP: state.playerHP, aiHP: state.aiHP, reason: 'knockout' });
        return true;
    }
    if (state.aiHP <= 0) {
        setGameOver({ winner: 'You', playerHP: state.playerHP, aiHP: state.aiHP, reason: 'knockout' });
        return true;
    }
    if (state.deck.length === 0) {
        const winner = state.playerHP > state.aiHP ? 'You'
        : state.aiHP > state.playerHP ? 'AI' : 'Tie';
        setGameOver({ winner, playerHP: state.playerHP, aiHP: state.aiHP, reason: 'deckout' });
        return true;
    }
    return false;
    };

  const initGame = useCallback(() => {
    const deck = shuffle([...CARD_DATA, ...CARD_DATA]);
    const playerHand = [], aiHand = [];
    for (let i = 0; i < 6; i++) {
      playerHand.push(deck.pop());
      aiHand.push(deck.pop());
    }
    const initial = {
      deck,
      playerHand,
      aiHand,
      playerHP: 20,
      aiHP: 20,
      turn: 'player',
      lastPlayed: null
    };
    gameStateRef.current = initial;
    setGameState(initial);
    setSelected([]);
    setLog([]);
    setGameOver(null);
    setStatus('Your turn! Select cards to play.');
  }, []);

  const toggleCard = useCallback((idx) => {
    if (!gameState || gameState.turn !== 'player') return;
    const card = gameState.playerHand[idx];
    setSelected(prev => {
      if (prev.includes(idx)) return prev.filter(i => i !== idx);
      if (card.type === 'double') {
        return prev.length === 0 ? [idx] : prev;
      }
      if (prev.length === 0) return [idx];
      if (prev.length === 1 && gameState.playerHand[prev[0]].type !== 'double') {
        return [...prev, idx];
      }
      return prev;
    });
  }, [gameState]);

  const doAITurn = useCallback((currentState) => {
    const prev = currentState;
    const next = {
      ...prev,
      aiHand: [...prev.aiHand],
      playerHand: [...prev.playerHand],
      deck: [...prev.deck]
    };

    const play = aiChoosePlay(next.aiHand);
    if (!play) {
      next.turn = 'player';
      gameStateRef.current = next;
      setGameState(next);
      setStatus('Your turn! Select cards to play.');
      return;
    }

    const cards = play.indices.map(i => next.aiHand[i]);
    const effect = calcEffect(cards);

    if (play.target === 'self') {
        next.aiHP = Math.max(0, prev.aiHP + effect);
    } else {
      next.playerHP = Math.max(0, prev.playerHP + effect);
    }

    play.indices.sort((a, b) => b - a).forEach(i => next.aiHand.splice(i, 1));
    while (next.aiHand.length < 6 && next.deck.length > 0) {
      next.aiHand.push(next.deck.pop());
    }

    next.lastPlayed = cards[cards.length - 1];
    next.turn = 'player';

    addLog(`AI played ${cards.map(c => c.name).join(' + ')} on ${play.target === 'self' ? 'itself' : 'you'} (${effect >= 0 ? '+' : ''}${effect} HP)`);

    gameStateRef.current = next;
    setGameState(next);

    if (!checkEnd(next)) {
      setStatus('Your turn! Select cards to play.');
    }
  }, []);

  const playCards = useCallback((target) => {
    if (!gameState || selected.length === 0) return;
    const cards = selected.map(i => gameState.playerHand[i]);
    const effect = calcEffect(cards);

    const next = {
      ...gameState,
      playerHand: [...gameState.playerHand],
      aiHand: [...gameState.aiHand],
      deck: [...gameState.deck]
    };

    if (target === 'self') {
      next.playerHP = Math.max(0, gameState.playerHP + effect);
    } else {
      next.aiHP = Math.max(0, gameState.aiHP + effect);
    }

    [...selected].sort((a, b) => b - a).forEach(i => next.playerHand.splice(i, 1));
    while (next.playerHand.length < 6 && next.deck.length > 0) {
      next.playerHand.push(next.deck.pop());
    }

    next.lastPlayed = cards[cards.length - 1];
    next.turn = 'ai';

    addLog(`You played ${cards.map(c => c.name).join(' + ')} on ${target === 'self' ? 'yourself' : 'AI'} (${effect >= 0 ? '+' : ''}${effect} HP)`);

    setSelected([]);
    gameStateRef.current = next;
    setGameState(next);

    if (!checkEnd(next)) {
      setStatus('AI is thinking...');
      setTimeout(() => doAITurn(next), 1300);
    }
  }, [gameState, selected, doAITurn]);

  return { gameState, selected, log, gameOver, status, initGame, toggleCard, playCards };
}