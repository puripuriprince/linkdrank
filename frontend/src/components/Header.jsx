import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Header() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/30 backdrop-blur-md border-b border-white/40 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          LinkdRank
        </Link>
        <button
          className="md:hidden focus:outline-none text-gray-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <nav className="hidden md:flex space-x-6">
          <Link to="/search" className="hover:text-gray-700 text-gray-800">
            Search
          </Link>
          <Link to="/leaderboard" className="hover:text-gray-700 text-gray-800">
            Leaderboard
          </Link>
          {user ? (
            <>
              <Link to="/submit-profile" className="hover:text-gray-700 text-gray-800">
                Submit Profile
              </Link>
              <button onClick={handleLogout} className="hover:text-gray-700 text-gray-800">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-gray-700 text-gray-800">
              Login
            </Link>
          )}
        </nav>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden bg-white/30 backdrop-blur-md border-t border-white/40 px-4 py-2">
          <Link to="/search" className="block py-2 hover:text-gray-700 text-gray-800" onClick={() => setIsMenuOpen(false)}>
            Search
          </Link>
          <Link to="/leaderboard" className="block py-2 hover:text-gray-700 text-gray-800" onClick={() => setIsMenuOpen(false)}>
            Leaderboard
          </Link>
          {user ? (
            <>
              <Link to="/submit-profile" className="block py-2 hover:text-gray-700 text-gray-800" onClick={() => setIsMenuOpen(false)}>
                Submit Profile
              </Link>
              <button onClick={handleLogout} className="block py-2 w-full text-left hover:text-gray-700 text-gray-800">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="block py-2 hover:text-gray-700 text-gray-800" onClick={() => setIsMenuOpen(false)}>
              Login
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}

export default Header;
