// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './userContext';

const PrivateRoute = ({ children }) => {
    const { user} = useUser();

  // If not authenticated, redirect to login page
    if (user == null) {
        return <Navigate to="/login" replace />;
    }

  // If authenticated, render the protected component
    return children;
};

export default PrivateRoute;
