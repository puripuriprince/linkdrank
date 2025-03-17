import api from './api';

export const submitVote = async (queryId, winnerProfileId, loserProfileId, userId = null) => {
  try {
    const response = await api.post('/vote', {
      query_id: queryId,
      winner_profile_id: winnerProfileId,
      loser_profile_id: loserProfileId,
      user_id: userId
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting vote:', error);
    throw error;
  }
};

export const getVoteHistory = async () => {
  try {
    const response = await api.get('/vote/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching vote history:', error);
    throw error;
  }
};
