const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');
const { generateEmbedding } = require('../services/vectorization');
const { validateProfile, validate } = require('../middleware/validation');
const { asyncHandler } = require('../utils/errorHandler');
const authMiddleware = require('../middleware/auth');

// GET all profiles (with pagination)
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const start = (page - 1) * limit;
  const end = start + limit - 1;
  const { data, error, count } = await supabase
    .from('profiles')
    .select('id, name, summary, skills, elo_rating, linkedin_url', { count: 'exact' })
    .range(start, end);
  if (error) {
    res.status(500);
    throw new Error(error.message);
  }
  res.json({ profiles: data, pagination: { totalCount: count, currentPage: page, pageSize: limit, totalPages: Math.ceil(count / limit) } });
}));

// GET a profile by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116') {
      res.status(404);
      throw new Error('Profile not found');
    }
    res.status(500);
    throw new Error(error.message);
  }
  res.json(data);
}));

// POST create a new profile
router.post('/', [authMiddleware, validateProfile, validate], asyncHandler(async (req, res) => {
  const { name, summary, experience, skills, education, linkedin_url } = req.body;
  const user_id = req.user.id;
  const profileText = `${name} ${summary} ${experience} ${skills.join(' ')} ${education}`;
  const embedding = await generateEmbedding(profileText);
  const { data, error } = await supabase
    .from('profiles')
    .insert({ user_id, name, summary, experience, skills, education, linkedin_url, embedding, elo_rating: 1500 })
    .select();
  if (error) {
    res.status(500);
    throw new Error(error.message);
  }
  res.status(201).json(data[0]);
}));

// PUT update a profile
router.put('/:id', [authMiddleware, validateProfile, validate], asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, summary, experience, skills, education, linkedin_url } = req.body;
  const user_id = req.user.id;
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('id', id)
    .single();
  if (!existingProfile) {
    res.status(404);
    throw new Error('Profile not found');
  }
  if (existingProfile.user_id !== user_id) {
    res.status(403);
    throw new Error('Not authorized to update this profile');
  }
  const profileText = `${name} ${summary} ${experience} ${skills.join(' ')} ${education}`;
  const embedding = await generateEmbedding(profileText);
  const { data, error } = await supabase
    .from('profiles')
    .update({ name, summary, experience, skills, education, linkedin_url, embedding, updated_at: new Date() })
    .eq('id', id)
    .select();
  if (error) {
    res.status(500);
    throw new Error(error.message);
  }
  res.json(data[0]);
}));

// DELETE a profile
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('id', id)
    .single();
  if (!existingProfile) {
    res.status(404);
    throw new Error('Profile not found');
  }
  if (existingProfile.user_id !== user_id) {
    res.status(403);
    throw new Error('Not authorized to delete this profile');
  }
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);
  if (error) {
    res.status(500);
    throw new Error(error.message);
  }
  res.json({ message: 'Profile deleted successfully' });
}));

module.exports = router;
