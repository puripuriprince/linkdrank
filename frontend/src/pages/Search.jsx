import React, { useState, useEffect, useRef } from 'react';
// Import the separate NetworkGraphBackground component
import NetworkGraphBackground from './NetworkGraphBackground';  // Adjust path if needed

export default function Search() {
  // Toggle for "Personalized?" option
  const [personalized, setPersonalized] = useState(false);
  // Search input state
  const [searchText, setSearchText] = useState('');
  // Ref for carousel container
  const carouselRef = useRef(null);

  // Example quick tag data
  const quickTags = [
    { label: 'in Web3 or crypto' },
    { label: 'PhDs now working at FAANG companies' },
  ];

  // Example "CRACKDDDD People" data
  const people = [
    {
      name: 'Lucas Miranda',
      role: 'Software engineering & finance student',
      location: 'Montréal, Canada',
      edu: 'JMSB',
      linkedin: 'https://www.linkedin.com/in/cielofinsoen/',
      photoUrl: 'https://via.placeholder.com/60',
    },
    {
      name: 'Niklas Morningtoff',
      role: 'Contextual AI',
      location: 'San Jose, CA, United States',
      edu: 'Stanford d.school Space',
      linkedin: '#',
      photoUrl: 'https://via.placeholder.com/60',
    },
    {
      name: 'Rohan Sanda',
      role: 'Apple',
      location: 'Stanford Shared Space',
      edu: 'Stanford Computer Science MS',
      linkedin: '#',
      photoUrl: 'https://via.placeholder.com/60',
    },
    {
      name: 'Hailey So',
      role: 'Apple',
      location: 'Stanford, CA',
      edu: 'Stanford Graduate School of Education',
      linkedin: '#',
      photoUrl: 'https://via.placeholder.com/60',
    },
    {
      name: 'Grace Jin',
      role: 'Apple',
      location: 'San Francisco, CA',
      edu: 'Stanford Computer Science BS',
      linkedin: '#',
      photoUrl: 'https://via.placeholder.com/60',
    },
  ];

  // Create a tripled array to ensure enough content for seamless looping
  const tripleContent = [...people, ...people, ...people];

  // Handle width calculation for seamless scrolling
  useEffect(() => {
    if (!carouselRef.current) return;
    
    // Ensure the animation works correctly by adjusting the animation properties
    const carouselWidth = carouselRef.current.scrollWidth / 3;
    carouselRef.current.style.setProperty('--carousel-width', `${carouselWidth}px`);
  }, []);

  const handleSearch = () => {
    console.log('Searching for:', searchText, 'Personalized:', personalized);
    // Insert your search logic here...
  };

  return (
    <>
      {/* Add the network graph background */}
      <NetworkGraphBackground />
      
      {/* Main content */}
      <div
        className="
          relative min-h-screen 
          bg-[url('https://images.unsplash.com/photo-1673462255986-0f931ed0c6c4?ixid=...')]
          bg-no-repeat bg-cover bg-fixed
          flex flex-col
        "
      >

        {/* Hero / Search Section */}
        <div className="flex flex-col items-center justify-center flex-grow px-4 pt-20 md:pt-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2 text-center">
            The Modern Alumni Network for McGill and Concordia
          </h1>
          <p className="text-md md:text-lg text-gray-600 mb-4 text-center">
            Alumni who studied abroad and now work internationally
          </p>

          {/* Big Search Box */}
          <div className="relative w-full max-w-2xl mt-4">
            <textarea
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="e.g. Alumni who studied abroad and now work internationally"
              rows={5}
              className="
                w-full py-3 px-4 pr-16
                rounded-xl bg-white/70 backdrop-blur-sm border border-gray-300 text-gray-800
                focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none
              "
            />
            {/* Personalized checkbox in bottom-left */}
            <div className="absolute bottom-2 left-3 flex items-center space-x-1">
              <input
                type="checkbox"
                checked={personalized}
                onChange={(e) => setPersonalized(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-800">Personalized?</label>
            </div>
            {/* Search button in top-right */}
            <button
              onClick={handleSearch}
              className="
                absolute top-2 right-3
                text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700
              "
            >
              Search
            </button>
          </div>

          {/* Quick Tags */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            {quickTags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => setSearchText(tag.label)}
                className="px-4 py-1 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full text-sm text-gray-700 hover:bg-white/80 transition"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* "CRACKDDDD People" Animated Carousel */}
        <div className="w-full mt-8 py-4 bg-transparent overflow-hidden">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
            CRACKDDDD People <span className="text-orange-500">🔥</span>
          </h2>
          
          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            <div 
              ref={carouselRef}
              className="flex carousel-content"
            >
              {/* Render items three times for a seamless loop */}
              {tripleContent.map((person, idx) => (
  <div
    key={idx}
    onClick={() => {
      if (person.linkedin && person.linkedin !== '#') {
        window.open(person.linkedin, '_blank');
      }
      console.log("Clicked", person.name);
    }}
    className="min-w-[300px] flex-shrink-0 mx-3 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl p-4 flex flex-col items-center space-y-2 cursor-pointer hover:shadow-md transition"
  >
    <img
      src={person.photoUrl}
      alt={person.name}
      className="w-12 h-12 rounded-full bg-gray-300"
    />
    <div className="text-center">
      <h3 className="font-semibold text-gray-800">{person.name}</h3>
      <p className="text-sm text-gray-500">{person.role}</p>
      <p className="text-xs text-gray-400">{person.location}</p>
      <p className="text-xs text-gray-400">{person.edu}</p>
    </div>
  </div>
))}


            </div>
          </div>
        </div>

        {/* CSS for carousel animation */}
        <style>{`
          .carousel-content {
            animation: carousel-scroll 60s linear infinite;
            will-change: transform;
          }
          
          @keyframes carousel-scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-1 * var(--carousel-width)));
            }
          }
          
          @keyframes bounce {
            0%, 100% {
              transform: translateY(-25%);
              animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
            }
            50% {
              transform: translateY(0);
              animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
            }
          }
          
          .animate-bounce {
            animation: bounce 1s infinite;
          }
        `}</style>
      </div>
    </>
  );
}
