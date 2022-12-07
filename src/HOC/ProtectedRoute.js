import React from "react";

import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ component, ...props }) => {
	console.log(1, 'зашли в ProtectedRoute');
	
	if(!props.isLoggedIn) {
		console.log(2, 'логин не прошел');
		return <Navigate to="/sign-in" />
	}

	return component ? component : <Outlet />
}
