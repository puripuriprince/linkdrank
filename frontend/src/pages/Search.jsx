import React, { useState, useEffect, useRef } from 'react';
import NetworkGraphBackground from './NetworkGraphBackground';
import { searchProfiles } from '../services/searchService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Search() {
  const [personalized, setPersonalized] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const peopleCarouselRef = useRef(null);
  const suggestionsCarouselRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  const quickTags = [
    { label: 'in Web3 or crypto' },
    { label: 'PhDs now working at FAANG companies' },
    { label: 'McGill grads at Google' },
    { label: 'Product managers in fintech' },
    { label: 'Concordia alumni in Silicon Valley' },
    { label: 'Architects working in sustainability' },
    { label: 'Lawyers specializing in tech' },
    { label: 'Medical researchers at top hospitals' },
    { label: 'Engineering leads in AI startups' },
    { label: 'UX designers at Series A startups' },
    { label: 'Data scientists in renewable energy' },
    { label: 'MBA grads who switched to tech' },
    { label: 'Psychology majors in HR leadership' },
  ];

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
    {
      name: 'Alice Smith',
      role: 'Developer at Tech Corp',
      location: 'Toronto, Canada',
      edu: 'University of Toronto',
      linkedin: 'https://www.linkedin.com/in/alicesmith/',
      photoUrl: 'https://via.placeholder.com/60',
    },
    {
      name: 'Bob Johnson',
      role: 'Data Scientist',
      location: 'New York, USA',
      edu: 'NYU',
      linkedin: 'https://www.linkedin.com/in/bobjohnson/',
      photoUrl: 'https://via.placeholder.com/60',
    },
    {
      name: 'Carol Williams',
      role: 'Product Manager',
      location: 'San Francisco, USA',
      edu: 'Stanford University',
      linkedin: 'https://www.linkedin.com/in/carolwilliams/',
      photoUrl: 'https://via.placeholder.com/60',
    },
    {
      name: 'David Brown',
      role: 'UX Designer',
      location: 'London, UK',
      edu: 'Imperial College',
      linkedin: 'https://www.linkedin.com/in/davidbrown/',
      photoUrl: 'https://via.placeholder.com/60',
    },
    {
      name: 'Emma Davis',
      role: 'Marketing Specialist',
      location: 'Sydney, Australia',
      edu: 'University of Sydney',
      linkedin: 'https://www.linkedin.com/in/emmadavis/',
      photoUrl: 'https://via.placeholder.com/60',
    },
    {
      name: 'Frank Miller',
      role: 'Software Engineer',
      location: 'Berlin, Germany',
      edu: 'TU Berlin',
      linkedin: 'https://www.linkedin.com/in/frankmiller/',
      photoUrl: 'https://via.placeholder.com/60',
    },
    {
      name: 'Grace Lee',
      role: 'Research Scientist',
      location: 'Seoul, South Korea',
      edu: 'KAIST',
      linkedin: 'https://www.linkedin.com/in/gracelee/',
      photoUrl: 'https://via.placeholder.com/60',
    },
    {
      name: 'Henry Wilson',
      role: 'Entrepreneur',
      location: 'San Jose, USA',
      edu: 'UC Berkeley',
      linkedin: 'https://www.linkedin.com/in/henrywilson/',
      photoUrl: 'https://via.placeholder.com/60',
    },
    {
      name: 'Ivy Turner',
      role: 'UX Researcher',
      location: 'Boston, USA',
      edu: 'MIT',
      linkedin: 'https://www.linkedin.com/in/ivyturner/',
      photoUrl: 'https://via.placeholder.com/60',
    },
    {
      name: 'Jackie Martinez',
      role: 'Business Analyst',
      location: 'Madrid, Spain',
      edu: 'IE Business School',
      linkedin: 'https://www.linkedin.com/in/jackiemartinez/',
      photoUrl: 'https://via.placeholder.com/60',
    },
  ];

  const doublePeople = [...people, ...people, ...people];

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = prev + 1;
        if (nextSlide >= people.length) {
          return nextSlide;
        }
        return nextSlide;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentSlide >= people.length * 2) {
      setTimeout(() => {
        if (peopleCarouselRef.current) {
          peopleCarouselRef.current.style.transition = 'none';
          setCurrentSlide(currentSlide % people.length);
          
          setTimeout(() => {
            if (peopleCarouselRef.current) {
              peopleCarouselRef.current.style.transition = 'transform 1.5s ease-in-out';
            }
          }, 50);
        }
      }, 1500);
    }
  }, [currentSlide]);

  useEffect(() => {
    if (suggestionsCarouselRef.current) {
      const suggestionsWidth = suggestionsCarouselRef.current.scrollWidth / 3;
      suggestionsCarouselRef.current.style.setProperty('--suggestions-width', `${suggestionsWidth}px`);
    }
  }, []);

  const calculateTransform = () => {
    const cardWidth = 305;
    const screenOffset = windowWidth;
    return `translateX(calc(-${currentSlide * cardWidth}px))`;
  };

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    
    setIsSearching(true);
    setError(null);
    
    try {
      const { profiles } = await searchProfiles(searchText);
      setSearchResults(profiles || []);
      setCurrentSlide(0);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <NetworkGraphBackground />
      
      <div className="relative min-h-screen bg-[url('https://images.unsplash.com/photo-1673462255986-0f931ed0c6c4?ixid=...')] bg-no-repeat bg-cover bg-fixed flex flex-col pb-10">
        <div className="flex flex-col items-center justify-center flex-grow px-4 pt-20 md:pt-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2 text-center">
            The Modern Alumni Network for McGill and Concordia
          </h1>
          

          <div className="w-full max-w-2xl relative">
            <div className="relative w-full">
              <textarea
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="e.g. Alumni who studied abroad and now work internationally"
                rows={5}
                className="w-full py-3 px-4 pr-16 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
              <div className="absolute bottom-2 left-3 flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={personalized}
                  onChange={(e) => setPersonalized(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-800">Personalized?</label>
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="absolute bottom-2 right-3 flex items-center justify-center h-8 w-8 rounded-full bg-white/40 backdrop-blur-md border border-white/50 shadow-md text-blue-600 font-bold hover:bg-white/60 hover:text-blue-700 transition duration-200"
              >
                {isSearching ? '...' : '↑'}
              </button>
            </div>
            
            <div className="w-full overflow-hidden mt-3">
              <div className="relative overflow-hidden">
                <div 
                  ref={suggestionsCarouselRef}
                  className="flex suggestions-carousel"
                >
                  {[...quickTags, ...quickTags, ...quickTags].map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchText(tag.label)}
                      className="min-w-max flex-shrink-0 mx-2 px-4 py-1.5 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full text-sm text-gray-700 hover:bg-white/80 transition"
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-8 py-4 bg-transparent">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
            CRACKDDDD People <span className="text-orange-500">🔥</span>
          </h2>
          
          <div className="relative w-full overflow-hidden">
            <div 
              ref={peopleCarouselRef}
              className="flex transition-transform duration-1500 ease-in-out"
              style={{ transform: calculateTransform() }}
            >
              {doublePeople.map((person, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (person.linkedin && person.linkedin !== '#') {
                      window.open(person.linkedin, '_blank');
                      console.log("Clicked", person.name);
                    }
                  }}
                  className="min-w-[300px] w-[300px] mx-[2.5px] bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl p-4 flex flex-col items-center space-y-2 cursor-pointer hover:shadow-md transition"
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

        {error && (
          <div className="text-red-600 text-center mt-4 bg-white/80 backdrop-blur-sm rounded-lg p-3 mx-auto max-w-md">
            {error}
          </div>
        )}
        
        {isSearching ? (
          <div className="flex justify-center mt-8">
            <LoadingSpinner />
          </div>
        ) : searchResults.length > 0 ? (
          <div className="w-full mt-8 py-4 bg-transparent">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
              Search Results <span className="text-orange-500">🔥</span>
            </h2>
            
            <div className="flex flex-wrap justify-center gap-4 px-4">
              {searchResults.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => {
                    if (profile.linkedin_url) {
                      window.open(profile.linkedin_url, '_blank');
                    }
                  }}
                  className="w-[300px] bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl p-4 flex flex-col items-center space-y-2 cursor-pointer hover:shadow-md transition"
                >
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-800">{profile.name}</h3>
                    <p className="text-sm text-gray-500">{profile.summary}</p>
                    <p className="text-xs text-gray-400">{profile.education}</p>
                    <p className="text-xs text-blue-500 mt-2">
                      Similarity: {(profile.similarity * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <style>{`
          .suggestions-carousel {
            animation: suggestions-scroll 40s linear infinite;
            will-change: transform;
            width: 100%; 
            padding: 2px 0;
          }
          
          @keyframes suggestions-scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-1 * var(--suggestions-width)));
            }
          }
          
          .transition-transform {
            transition-property: transform;
          }
          
          .duration-1500 {
            transition-duration: 1500ms;
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
