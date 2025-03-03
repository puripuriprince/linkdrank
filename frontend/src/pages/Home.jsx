import React from 'react';

function Home() {
  const leftProfile = {
    name: 'Makery Mentor | GSE Makery',
    role: 'Makerspace Lab Assistant',
    experience: [
      'Mechanical Design Engineer Intern: Semiconductor Equipment R&D',
      'lab64 Makerspace Lab Assistant: Stanford University School of Engineering',
    ],
    education: [
      'Stanford University: Graduate School of Education',
      'Duluth High School',
    ],
    honors: ['Georgia Scholar', 'Georgia Department of Education'],
  };

  const rightProfile = {
    name: 'SDE Intern',
    role: 'Amazon Web Services (AWS)',
    experience: [
      'SDE Intern: Amazon Web Services (AWS)',
      'SDE Intern: Microsoft',
    ],
    education: [
      'Stanford University: Bachelor of Science — BS in Engineering',
      'North High School',
    ],
    honors: [],
  };

  const handleVote = (side) => {
    if (side === 'left') {
      console.log('Voted for left profile');
      // TODO: call your vote API
    } else {
      console.log('Voted for right profile');
      // TODO: call your vote API
    }
  };

  const renderProfileDetails = (profile) => (
    <div className="space-y-4 mt-4 text-left">
      {/* Experience */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-1">Experience</h3>
        {profile.experience.map((item, idx) => (
          <p key={idx} className="text-sm text-gray-600 leading-snug">
            {item}
          </p>
        ))}
      </div>
      {/* Education */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-1">Education</h3>
        {profile.education.map((item, idx) => (
          <p key={idx} className="text-sm text-gray-600 leading-snug">
            {item}
          </p>
        ))}
      </div>
      {/* Honors */}
      {profile.honors && profile.honors.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-1">Honors</h3>
          {profile.honors.map((item, idx) => (
            <p key={idx} className="text-sm text-gray-600 leading-snug">
              {item}
            </p>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative min-h-screen flex bg-white">
      {/* Left Side (Hover jiggle, clickable) */}
      <div
        className="w-1/2 flex flex-col items-center justify-center p-8
                   transform transition-transform duration-300 hover:-translate-y-1
                   cursor-pointer border-r border-gray-200"
        onClick={() => handleVote('left')}
      >
        {/* Placeholder avatar */}
        <div className="w-20 h-20 bg-gray-300 rounded-full mb-4" />
        {/* Name & Role */}
        <h2 className="font-semibold text-lg text-gray-800">{leftProfile.name}</h2>
        <p className="text-sm text-gray-500">{leftProfile.role}</p>
        {renderProfileDetails(leftProfile)}
      </div>

      {/* Right Side (Hover jiggle, clickable) */}
      <div
        className="w-1/2 flex flex-col items-center justify-center p-8
                   transform transition-transform duration-300 hover:-translate-y-1
                   cursor-pointer"
        onClick={() => handleVote('right')}
      >
        {/* Placeholder avatar */}
        <div className="w-20 h-20 bg-gray-300 rounded-full mb-4" />
        {/* Name & Role */}
        <h2 className="font-semibold text-lg text-gray-800">{rightProfile.name}</h2>
        <p className="text-sm text-gray-500">{rightProfile.role}</p>
        {renderProfileDetails(rightProfile)}
      </div>

      {/* Vertical Divider & 'Equal' Label */}
      {/* The divider is part of the left side's border-r, so we only need the label */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   border border-gray-300 bg-white rounded-full px-4 py-1 text-sm text-gray-600 shadow"
      >
        Equal
      </div>
    </div>
  );
}

export default Home;
