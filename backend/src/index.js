const express = require('express');
const cors = require('cors');
require('dotenv').config();
const createSchema = require('./src/configs/createSchema');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await createSchema();
});