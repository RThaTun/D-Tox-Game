const getStartingHP = (playerCount) => {
  return playerCount <= 2 ? 20 : 10;
};

module.exports = { getStartingHP };