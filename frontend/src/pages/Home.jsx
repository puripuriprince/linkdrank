import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Home() {
  const { user } = useUser();
  return (
    <div>
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Find the Perfect LinkedIn Profile with AI</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">Search, compare and rank LinkedIn profiles using natural language queries and community feedback.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/search" className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 font-medium">Start Searching</Link>
            {!user && (
              <Link to="/login" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md shadow-md hover:bg-gray-300 font-medium">Create Account</Link>
            )}
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-blue-600 text-4xl mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Search with Natural Language</h3>
              <p className="text-gray-600">Use everyday language to find the perfect LinkedIn profile. Our AI understands what you're looking for.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-blue-600 text-4xl mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Compare & Vote</h3>
              <p className="text-gray-600">Choose between pairs of profiles to help our system learn which profiles are truly the best matches.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-blue-600 text-4xl mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">View the Leaderboard</h3>
              <p className="text-gray-600">See the top-ranked profiles based on our Elo rating system that combines AI matching and community feedback.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to find the best profiles?</h2>
          <Link to="/search" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 font-medium">Get Started</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
