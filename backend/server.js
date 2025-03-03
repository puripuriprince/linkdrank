// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { HfInference } = require('@huggingface/inference');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Initialize Hugging Face client
const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

// Import routes
const profileRoutes = require('./routes/profiles');
const queryRoutes = require('./routes/queries');
const voteRoutes = require('./routes/votes');
const leaderboardRoutes = require('./routes/leaderboard');

// Use routes
app.use('/api/profiles', profileRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
