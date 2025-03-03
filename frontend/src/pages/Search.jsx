import React, { useState } from 'react';
import api from '../services/api';
import { useUser } from '../context/UserContext';
import ProfileCard from '../components/ProfileCard';
import ProfileComparison from '../components/ProfileComparison';
import SearchForm from '../components/SearchForm';
import LoadingSpinner from '../components/LoadingSpinner';

function Search() {
  const { user } = useUser();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [queryId, setQueryId] = useState(null);
  const [error, setError] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [voteMessage, setVoteMessage] = useState('');

  const handleSearch = async (queryText) => {
    setIsSearching(true);
    setError(null);
    setVoteMessage('');
    setShowComparison(false);
    try {
      const response = await api.post('/query', { query_text: queryText, user_id: user?.id || null });
      setSearchResults(response.data.profiles);
      setQueryId(response.data.query_id);
      if (response.data.profiles.length >= 2) {
        setSelectedProfiles(response.data.profiles.slice(0, 2));
        setShowComparison(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const handleVote = async (winnerId, loserId) => {
    try {
      await api.post('/vote', { user_id: user?.id, query_id: queryId, winner_profile_id: winnerId, loser_profile_id: loserId });
      setVoteMessage('Thanks for your vote!');
      setShowComparison(false);
      const updatedResults = searchResults.map(profile => {
        if (profile.id === winnerId) return { ...profile, elo_rating: profile.elo_rating + 10 };
        if (profile.id === loserId) return { ...profile, elo_rating: profile.elo_rating - 5 };
        return profile;
      });
      setSearchResults(updatedResults);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to record vote');
    }
  };

  const handleCompare = () => {
    if (searchResults.length >= 2) {
      setSelectedProfiles(searchResults.slice(0, 2));
      setShowComparison(true);
      setVoteMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search LinkedIn Profiles</h1>
      <SearchForm onSearch={handleSearch} isSearching={isSearching} />
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {voteMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {voteMessage}{" "}
          <button onClick={handleCompare} className="underline text-green-700 hover:text-green-800">Compare more profiles</button>
        </div>
      )}
      {isSearching && (
        <div className="my-12">
          <LoadingSpinner message="Searching for relevant profiles..." />
        </div>
      )}
      {showComparison ? (
        <ProfileComparison profiles={selectedProfiles} onVote={handleVote} onCancel={() => setShowComparison(false)} />
      ) : (
        <div>
          {searchResults.length > 0 && !isSearching && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Search Results ({searchResults.length})</h2>
                {searchResults.length > 1 && !voteMessage && (
                  <button onClick={handleCompare} className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">Compare Profiles</button>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {searchResults.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} similarity={profile.similarity} />
                ))}
              </div>
            </>
          )}
          {searchResults.length === 0 && !isSearching && (
            <p className="text-gray-600 text-center py-10">No profiles found. Try a different search query.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
