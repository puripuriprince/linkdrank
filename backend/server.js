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
  'https://rszxpqtzxjykvkjwdqhi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzenhwcXR6eGp5a3ZrandkcWhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDk2MTkwNSwiZXhwIjoyMDU2NTM3OTA1fQ.MGKwJDcTS8L6djEQvANrYprSqB5cRfxl3g1ZfpSw8jA'
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
