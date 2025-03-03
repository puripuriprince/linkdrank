import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">LinkedRank</h3>
            <p className="text-gray-300">Find and rank the best LinkedIn profiles using AI and community feedback.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/search" className="text-gray-300 hover:text-white">Search</Link></li>
              <li><Link to="/leaderboard" className="text-gray-300 hover:text-white">Leaderboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <p className="text-gray-300">Have feedback? <a href="mailto:contact@linkedrank.com" className="text-blue-400 hover:text-blue-300">Contact us</a></p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} LinkedRank. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
