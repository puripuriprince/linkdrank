import React from 'react';

function ProfileCard({ profile, similarity }) {
  const formatSkills = (skills) => {
    if (!skills || !Array.isArray(skills) || skills.length === 0) return 'No skills listed';
    return skills.slice(0, 5).join(', ') + (skills.length > 5 ? '...' : '');
  };

  const formatSimilarityScore = (score) => {
    if (score === undefined || score === null) return '';
    return `${(score * 100).toFixed(1)}% match`;
  };

  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900">{profile.name}</h3>
          <div className="flex items-center">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">Elo: {profile.elo_rating}</span>
            {similarity !== undefined && (
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                {formatSimilarityScore(similarity)}
              </span>
            )}
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{profile.summary || 'No summary provided'}</p>
        <div className="text-sm text-gray-500 mb-3">
          <span className="font-medium">Skills:</span> {formatSkills(profile.skills)}
        </div>
        {profile.linkedin_url && (
          <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            View LinkedIn Profile
          </a>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;
