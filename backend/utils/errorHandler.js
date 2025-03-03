/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    console.error(err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({ error: err.message, stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack });
  };
  
  /**
   * Async handler to avoid try-catch in routes
   */
  const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  
  module.exports = { errorHandler, asyncHandler };
  