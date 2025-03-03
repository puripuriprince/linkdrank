const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');
const { generateEmbedding } = require('../services/vectorization');
const { validateQuery, validate } = require('../middleware/validation');
const { asyncHandler } = require('../utils/errorHandler');

// POST route to handle a query and return relevant profiles
router.post('/', [validateQuery, validate], asyncHandler(async (req, res) => {
  const { query_text, user_id } = req.body;
  const embedding = await generateEmbedding(query_text);
  const { data: queryData, error: queryError } = await supabase
    .from('queries')
    .insert({ query_text, user_id, embedding })
    .select();
  if (queryError) {
    res.status(500);
    throw new Error(queryError.message);
  }
  const { data: profiles, error: searchError } = await supabase
    .rpc('match_profiles', { query_embedding: embedding, match_threshold: 0.5, match_count: 10 });
  if (searchError) {
    res.status(500);
    throw new Error(searchError.message);
  }
  res.json({ query_id: queryData[0].id, profiles });
}));

// GET recent queries
router.get('/recent', asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('queries')
    .select('id, query_text, created_at')
    .order('created_at', { ascending: false })
    .limit(10);
  if (error) {
    res.status(500);
    throw new Error(error.message);
  }
  res.json(data);
}));

module.exports = router;
