// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './userContext';
import { useEffect, useState } from 'react';



const PrivateRoute = ({ children }) => {
  const { user, loadUser} = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
        const result = await loadUser();
        setIsAuthenticated(result);
        setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
      return <div>Loading...</div>; // or your loading component
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
