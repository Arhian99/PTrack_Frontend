


import React, { useEffect } from 'react';
import useAuth from '../hooks/useAuth'
import {useNavigate, Outlet} from 'react-router-dom'

/* This component wraps all protected routes, when user goes to protected route, this component is mounted.
It checks whether there is a currently authenticated user (checks if user state variable is null). If NOT, 
it redirects user to /authenticate URL. If there is a user object, it checks if the account is enabled, if NOT
it redirects user to /unconfirmed URL. If user object is set AND user account is enabled, it allows user to proceed to protected route*/
export default function ProtectedRoutes() {
    const {user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if(user===null){
        navigate("/authenticate")
      } else if(user.user.isEnabled === false){
        navigate("/unconfirmed")
      } 
    }, [user])


  return (
    <Outlet />
  )
}
