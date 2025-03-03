import React, { useEffect, useState } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfileCard from '../components/ProfileCard';

function Leaderboard() {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skillFilter, setSkillFilter] = useState('');
  const [commonSkills, setCommonSkills] = useState([]);
  const [activeTab, setActiveTab] = useState('overall');

  useEffect(() => {
    fetchLeaderboard();
    fetchCommonSkills();
  }, []);

  useEffect(() => {
    if (activeTab === 'overall') {
      fetchLeaderboard();
    } else if (activeTab === 'skill' && skillFilter) {
      fetchLeaderboardBySkill(skillFilter);
    } else if (activeTab === 'rising') {
      fetchRisingProfiles();
    }
  }, [activeTab, skillFilter]);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/leaderboard');
      setProfiles(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeaderboardBySkill = async (skill) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/leaderboard/skills/${skill}`);
      setProfiles(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch skill leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRisingProfiles = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/leaderboard/rising');
      setProfiles(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch rising profiles');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommonSkills = async () => {
    try {
      setCommonSkills(['JavaScript', 'React', 'Python', 'Product Management', 'UX Design']);
    } catch (err) {
      console.error('Failed to fetch common skills', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Profile Leaderboard</h1>
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap -mb-px">
            <button onClick={() => setActiveTab('overall')} className={`py-2 px-4 border-b-2 ${activeTab === 'overall' ? 'border-blue-500 text-blue-600' : 'border-transparent hover:border-gray-300 text-gray-500'}`}>Overall Ranking</button>
            <button onClick={() => setActiveTab('skill')} className={`py-2 px-4 border-b-2 ${activeTab === 'skill' ? 'border-blue-500 text-blue-600' : 'border-transparent hover:border-gray-300 text-gray-500'}`}>By Skill</button>
            <button onClick={() => setActiveTab('rising')} className={`py-2 px-4 border-b-2 ${activeTab === 'rising' ? 'border-blue-500 text-blue-600' : 'border-transparent hover:border-gray-300 text-gray-500'}`}>Rising Stars</button>
          </nav>
        </div>
        {activeTab === 'skill' && (
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by skill</label>
            <div className="flex">
              <select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} className="flex-grow p-2 border border-gray-300 rounded-md mr-2">
                <option value="">Select a skill</option>
                {commonSkills.map(skill => (<option key={skill} value={skill}>{skill}</option>))}
              </select>
            </div>
          </div>
        )}
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      )}
      {isLoading ? (
        <LoadingSpinner message="Loading leaderboard data..." />
      ) : profiles.length > 0 ? (
        <div>
          <div className="grid md:grid-cols-2 gap-6">
            {profiles.map((profile, index) => (
              <div key={profile.id} className="relative">
                <div className="absolute -left-4 -top-2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">{index + 1}</div>
                <ProfileCard profile={profile} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No profiles available yet.</p>
      )}
    </div>
  );
}

export default Leaderboard;
