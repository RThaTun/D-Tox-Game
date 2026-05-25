const GameModel = require('../models/gameModel');
const { getStartingHP } = require('../services/gameService');

const GameController = {
  getSession: async (req, res) => {
    try {
      const session = await GameModel.findByRoomCode(req.params.code);
      if (!session) return res.status(404).json({ error: 'Session not found' });
      res.json(session);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = GameController;