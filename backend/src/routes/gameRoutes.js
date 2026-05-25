const express = require('express');
const router = express.Router();
const GameController = require('../controllers/gameController');

router.get('/session/:code', GameController.getSession);

module.exports = router;