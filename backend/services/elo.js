// K-factor determines how much impact each match has on ratings
const K_FACTOR = 32;

/**
 * Calculate new Elo ratings after a match
 * @param {number} winnerRating - Current rating of the winner
 * @param {number} loserRating - Current rating of the loser
 * @returns {Object} - Object containing new ratings
 */
function calculateNewRatings(winnerRating, loserRating) {
  const expectedWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  const expectedLoser = 1 / (1 + Math.pow(10, (winnerRating - loserRating) / 400));
  const newWinnerRating = Math.round(winnerRating + K_FACTOR * (1 - expectedWinner));
  const newLoserRating = Math.round(loserRating + K_FACTOR * (0 - expectedLoser));
  return { newWinnerRating, newLoserRating };
}

module.exports = { calculateNewRatings, K_FACTOR };
