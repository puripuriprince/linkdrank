import React from 'react';

function ProfileComparison({ profiles, onVote, onCancel }) {
  if (!profiles || profiles.length < 2) return <div>Insufficient profiles for comparison</div>;
  const [profile1, profile2] = profiles;
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg border">
      <h2 className="text-xl font-bold mb-6 text-center">Which profile is a better match?</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col border rounded-lg p-6 bg-white hover:shadow-lg cursor-pointer transition-all transform hover:-translate-y-1" onClick={() => onVote(profile1.id, profile2.id)}>
          <div className="flex justify-between mb-2">
            <h3 className="text-lg font-semibold">{profile1.name}</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">Elo: {profile1.elo_rating}</span>
          </div>
          <p className="text-gray-700 text-sm mb-4">{profile1.summary}</p>
          <div className="text-xs text-gray-500 mb-2"><strong>Skills:</strong> {profile1.skills ? profile1.skills.join(', ') : 'None listed'}</div>
          {profile1.similarity !== undefined && (
            <div className="text-xs text-green-600 font-medium">Match score: {(profile1.similarity * 100).toFixed(1)}%</div>
          )}
          <button className="mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={(e) => { e.stopPropagation(); onVote(profile1.id, profile2.id); }}>
            Select this profile
          </button>
        </div>
        <div className="flex flex-col border rounded-lg p-6 bg-white hover:shadow-lg cursor-pointer transition-all transform hover:-translate-y-1" onClick={() => onVote(profile2.id, profile1.id)}>
          <div className="flex justify-between mb-2">
            <h3 className="text-lg font-semibold">{profile2.name}</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">Elo: {profile2.elo_rating}</span>
          </div>
          <p className="text-gray-700 text-sm mb-4">{profile2.summary}</p>
          <div className="text-xs text-gray-500 mb-2"><strong>Skills:</strong> {profile2.skills ? profile2.skills.join(', ') : 'None listed'}</div>
          {profile2.similarity !== undefined && (
            <div className="text-xs text-green-600 font-medium">Match score: {(profile2.similarity * 100).toFixed(1)}%</div>
          )}
          <button className="mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={(e) => { e.stopPropagation(); onVote(profile2.id, profile1.id); }}>
            Select this profile
          </button>
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Skip comparison</button>
      </div>
    </div>
  );
}

export default ProfileComparison;
