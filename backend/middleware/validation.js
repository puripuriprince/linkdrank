const { body, validationResult } = require('express-validator');

const validateProfile = [
  body('name').notEmpty().withMessage('Name is required'),
  body('summary').notEmpty().withMessage('Summary is required'),
  body('experience').notEmpty().withMessage('Experience is required'),
  body('skills').isArray().withMessage('Skills must be an array'),
  body('linkedin_url').optional().isURL().withMessage('LinkedIn URL must be valid'),
];

const validateQuery = [
  body('query_text').notEmpty().withMessage('Query text is required'),
];

const validateVote = [
  body('query_id').isUUID().withMessage('Valid query ID is required'),
  body('winner_profile_id').isUUID().withMessage('Valid winner profile ID is required'),
  body('loser_profile_id').isUUID().withMessage('Valid loser profile ID is required'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validateProfile, validateQuery, validateVote, validate };
