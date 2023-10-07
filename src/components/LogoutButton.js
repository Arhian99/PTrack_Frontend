import React from 'react'
import { Button } from 'react-bootstrap'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom';

/* Logout button component, it sets global auth user to null AND sets the user object stored in 
localStorage to null as well. */
function LogoutButton() {
  const {setUser} = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    setUser(null); // sets global auth user to null
    window.localStorage.setItem('user', null) // sets 'user' object stored in localStorage to null.
    navigate('/Authenticate');
  }

  return (
    <Button onClick={handleLogout}>Logout</Button>
  )
}

export default LogoutButton