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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-100 pt-20 md:pt-32 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-glass-background backdrop-blur-glass border border-glass-border rounded-2xl shadow-glass p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Profile Leaderboard</h1>
          <div className="mb-8">
            <div className="border-b border-gray-200/30">
              <nav className="flex flex-wrap -mb-px">
                {['overall', 'skill', 'rising'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)} 
                    className={`py-2 px-4 border-b-2 text-sm uppercase tracking-wider transition-all duration-300 ${
                      activeTab === tab 
                        ? 'border-blue-500 text-blue-600 font-semibold' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.replace(/^\w/, c => c.toUpperCase())} Ranking
                  </button>
                ))}
              </nav>
            </div>
            {activeTab === 'skill' && (
              <div className="my-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by skill</label>
                <select 
                  value={skillFilter} 
                  onChange={(e) => setSkillFilter(e.target.value)} 
                  className="w-full p-2 border border-gray-300/50 rounded-lg bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 transition-all"
                >
                  <option value="">Select a skill</option>
                  {commonSkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100/50 backdrop-blur-sm border border-red-300/50 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner message="Loading leaderboard data..." />
        ) : profiles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile, index) => (
              <div 
                key={profile.id} 
                className="bg-glass-background backdrop-blur-glass border border-glass-border rounded-2xl shadow-glass p-4 transform transition-all duration-300 hover:scale-105 relative"
              >
                <div className="absolute -left-3 -top-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold z-10">
                  {index + 1}
                </div>
                <ProfileCard profile={profile} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-glass-background backdrop-blur-glass border border-glass-border rounded-2xl p-8 text-center">
            <p className="text-gray-600">No profiles available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
