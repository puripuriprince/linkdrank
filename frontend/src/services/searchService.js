import api from './api';

export const searchProfiles = async (queryText, userId = null) => {
  try {
    const response = await api.post('/query', {
      query_text: queryText,
      user_id: userId
    });
    return response.data;
  } catch (error) {
    console.error('Error searching profiles:', error);
    throw error;
  }
};

export const getRecentQueries = async () => {
  try {
    const response = await api.get('/query/recent');
    return response.data;
  } catch (error) {
    console.error('Error fetching recent queries:', error);
    throw error;
  }
};
