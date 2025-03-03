import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import LoadingSpinner from './LoadingSpinner';

function PrivateRoute({ children }) {
  const { user, loading } = useUser();
  const location = useLocation();
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner message="Checking authentication..." />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default PrivateRoute;
