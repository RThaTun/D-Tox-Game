const express = require('express');
const cors = require('cors');
require('dotenv').config();
const createSchema = require('./src/configs/createSchema');
const gameRoutes = require('./src/routes/gameRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/game', gameRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await createSchema();
});