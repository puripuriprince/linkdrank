import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitVote } from '../services/voteService';
import { useUser } from '../context/UserContext';

export default function Vote() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const [profiles, setProfiles] = useState([]);
  const [currentPair, setCurrentPair] = useState([]);
  const [queryId, setQueryId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [votingComplete, setVotingComplete] = useState(false);
  const [remainingPairs, setRemainingPairs] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get data from location state or session storage
    const stateProfiles = location.state?.profiles;
    const stateQueryId = location.state?.queryId;
    
    if (stateProfiles && stateQueryId) {
      initializeVoting(stateProfiles, stateQueryId);
    } else {
      // Try to get from session storage
      const storedProfiles = JSON.parse(sessionStorage.getItem('currentProfiles'));
      const storedQueryId = sessionStorage.getItem('currentQueryId');
      
      if (storedProfiles && storedQueryId) {
        initializeVoting(storedProfiles, storedQueryId);
      } else {
        // No data, redirect to search
        navigate('/search');
      }
    }
  }, [location, navigate]);

  const initializeVoting = (profilesData, qId) => {
    setProfiles(profilesData);
    setQueryId(qId);
    
    // Generate pairs for comparison
    const pairs = generatePairs(profilesData);
    setRemainingPairs(pairs.length);
    
    if (pairs.length > 0) {
      setCurrentPair(pairs[0]);
    } else {
      setVotingComplete(true);
    }
  };

  const generatePairs = (profilesArray) => {
    const pairs = [];
    // Take only the top 5 profiles to limit the number of comparisons
    const topProfiles = profilesArray.slice(0, 5);
    
    // Generate all possible unique pairs
    for (let i = 0; i < topProfiles.length; i++) {
      for (let j = i + 1; j < topProfiles.length; j++) {
        pairs.push([topProfiles[i], topProfiles[j]]);
      }
    }
    
    // Shuffle the pairs
    return shuffleArray(pairs);
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleVote = async (winnerIndex) => {
    if (isLoading || !currentPair[0] || !currentPair[1]) return;
    
    const winner = currentPair[winnerIndex];
    const loser = currentPair[winnerIndex === 0 ? 1 : 0];
    
    setIsLoading(true);
    setError(null);
    
    try {
      await submitVote(
        queryId,
        winner.id,
        loser.id,
        user?.id || null
      );
      
      // Move to next pair
      const updatedPairs = generatePairs(profiles);
      updatedPairs.shift(); // Remove the voted pair
      
      if (updatedPairs.length > 0) {
        setCurrentPair(updatedPairs[0]);
        setRemainingPairs(updatedPairs.length);
      } else {
        setVotingComplete(true);
      }
    } catch (err) {
      console.error('Voting error:', err);
      setError('Failed to submit vote. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (votingComplete) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Voting Complete!</h1>
          <p className="text-gray-600 mb-6">Thank you for your votes. These will help improve our profile rankings.</p>
          <button
            onClick={() => navigate('/search')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  if (!currentPair[0] || !currentPair[1]) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">Loading profiles for comparison...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Who's the better match?</h1>
        <p className="text-center mb-8 text-gray-600">
          Choose which profile better matches your search: "{location.state?.searchText || 'Your search'}"
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentPair.map((profile, index) => (
            <div 
              key={index}
              onClick={() => handleVote(index)}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
            >
              <img 
                src={profile.photo_url || "https://via.placeholder.com/100"} 
                alt={profile.name}
                className="w-20 h-20 rounded-full mb-4 object-cover"
              />
              <h2 className="text-xl font-semibold mb-2">{profile.name}</h2>
              <p className="text-gray-600 mb-1">{profile.role || profile.summary}</p>
              <p className="text-gray-500 text-sm">{profile.location}</p>
              <p className="text-gray-500 text-sm">{profile.education}</p>
              
              <button
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Choose This Profile'}
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center text-gray-500">
          {remainingPairs > 0 ? `${remainingPairs} comparisons remaining` : 'Final comparison'}
        </div>
      </div>
    </div>
  );
}
