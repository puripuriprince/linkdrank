const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');
const { asyncHandler } = require('../utils/errorHandler');

// GET overall leaderboard
router.get('/', asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, summary, skills, elo_rating, linkedin_url')
    .order('elo_rating', { ascending: false })
    .limit(100);
  if (error) {
    res.status(500);
    throw new Error(error.message);
  }
  res.json(data);
}));

// GET leaderboard with skill filter
router.get('/skills/:skill', asyncHandler(async (req, res) => {
  const { skill } = req.params;
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, summary, skills, elo_rating, linkedin_url')
    .contains('skills', [skill])
    .order('elo_rating', { ascending: false })
    .limit(50);
  if (error) {
    res.status(500);
    throw new Error(error.message);
  }
  res.json(data);
}));

// GET top rising profiles
router.get('/rising', asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .rpc('get_rising_profiles', { days_ago: 7, limit_count: 10 });
  if (error) {
    res.status(500);
    throw new Error(error.message);
  }
  res.json(data);
}));

module.exports = router;
