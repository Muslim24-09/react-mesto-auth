import React from "react";

import { Outlet, Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ component, ...props }) => {
	if (!props.loggedIn) {
		return  <Navigate to="/sign-up" />
	}
  return (
		component ? component : <Outlet />
	)  
}
