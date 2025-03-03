const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');
const { calculateNewRatings } = require('../services/elo');
const { validateVote, validate } = require('../middleware/validation');
const { asyncHandler } = require('../utils/errorHandler');
const authMiddleware = require('../middleware/auth');

// POST route to record a vote and update Elo ratings
router.post('/', [validateVote, validate], asyncHandler(async (req, res) => {
  const { query_id, winner_profile_id, loser_profile_id, user_id } = req.body;
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, elo_rating')
    .in('id', [winner_profile_id, loser_profile_id]);
  if (profilesError || profiles.length !== 2) {
    res.status(400);
    throw new Error('Invalid profile IDs');
  }
  const winner = profiles.find(p => p.id === winner_profile_id);
  const loser = profiles.find(p => p.id === loser_profile_id);
  const { newWinnerRating, newLoserRating } = calculateNewRatings(winner.elo_rating, loser.elo_rating);
  const { error: transactionError } = await supabase.rpc('update_ratings_and_record_vote', {
    p_query_id: query_id,
    p_winner_id: winner_profile_id,
    p_loser_id: loser_profile_id,
    p_user_id: user_id,
    p_winner_new_rating: newWinnerRating,
    p_loser_new_rating: newLoserRating
  });
  if (transactionError) {
    res.status(500);
    throw new Error(transactionError.message);
  }
  res.json({
    success: true,
    winner: { id: winner_profile_id, oldRating: winner.elo_rating, newRating: newWinnerRating },
    loser: { id: loser_profile_id, oldRating: loser.elo_rating, newRating: newLoserRating }
  });
}));

// GET vote history for a user
router.get('/history', authMiddleware, asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const { data, error } = await supabase
    .from('votes')
    .select(` id, created_at, query:queries(query_text), winner:winner_profile_id(id, name), loser:loser_profile_id(id, name) `)
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) {
    res.status(500);
    throw new Error(error.message);
  }
  res.json(data);
}));

module.exports = router;
