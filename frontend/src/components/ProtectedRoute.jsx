
import React, { useEffect } from 'react';
import { Navigate, Outlet ,useLocation} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { useSelector } from 'react-redux';
import NotFound from './NotFound';

// Higher-Order Component for Protected Routes
export default function ProtectedRoute({  requiredRole })  {
  const location = useLocation();
  const {tokenValue}=useSelector(store=>store.token);
  useEffect(() => {

  if (!tokenValue) {
    localStorage.setItem("redirectUrl", location.pathname);
    return <Navigate to="/login" replace />;
  }

  // Decode JWT to get user role
  const decodedToken = jwtDecode(tokenValue);

  

  // Check if the user has the required role
  if (decodedToken.role !== requiredRole) {
    return <NotFound/>;
  }
  localStorage.setItem("lastVisitedUrl", location.pathname);
}, [tokenValue, requiredRole, location.pathname]);

  return(
    <>
    <Outlet/>
    </>
  )
};
