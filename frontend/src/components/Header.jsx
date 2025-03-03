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
    <header className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">LinkedRank</Link>
        <button className="md:hidden focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <nav className="hidden md:flex space-x-6">
          <Link to="/search" className="hover:text-blue-200">Search</Link>
          <Link to="/leaderboard" className="hover:text-blue-200">Leaderboard</Link>
          {user ? (
            <>
              <Link to="/submit-profile" className="hover:text-blue-200">Submit Profile</Link>
              <button onClick={handleLogout} className="hover:text-blue-200">Logout</button>
            </>
          ) : (
            <Link to="/login" className="hover:text-blue-200">Login</Link>
          )}
        </nav>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden bg-blue-800 px-4 py-2">
          <Link to="/search" className="block py-2 hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>Search</Link>
          <Link to="/leaderboard" className="block py-2 hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>Leaderboard</Link>
          {user ? (
            <>
              <Link to="/submit-profile" className="block py-2 hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>Submit Profile</Link>
              <button onClick={handleLogout} className="block py-2 w-full text-left hover:text-blue-200">Logout</button>
            </>
          ) : (
            <Link to="/login" className="block py-2 hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>Login</Link>
          )}
        </nav>
      )}
    </header>
  );
}

export default Header;
