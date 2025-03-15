import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { login, signup } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.search?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isLoginMode) {
        await login(email, password);
        navigate(from, { replace: true });
      } else {
        await signup(email, password);
        setSuccessMessage('Registration successful! Check your email to confirm your account.');
        setIsLoginMode(true);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-24 md:p-20 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLoginMode ? 'Login to LinkedRank' : 'Create an Account'}
      </h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md ${
            isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Processing...' : isLoginMode ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          onClick={() => {
            setIsLoginMode(!isLoginMode);
            setError('');
            setSuccessMessage('');
          }}
          className="text-blue-600 hover:text-blue-800"
        >
          {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
      {isLoginMode && (
        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-gray-800">
            Forgot your password?
          </Link>
        </div>
      )}
    </div>
  );
}

export default Login;
