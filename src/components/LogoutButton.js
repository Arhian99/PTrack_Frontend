import React from 'react'
import { Button } from 'react-bootstrap'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom';
import useStomp from '../hooks/useStomp';
import { handleLogout } from '../utils/utilities';

/* Logout button component, it sets global auth user to null AND sets the user object stored in 
localStorage to null as well. */
function LogoutButton() {
  const {setUser} = useAuth();
  const navigate = useNavigate();
  const stompClient = useStomp();

  return (
    <Button onClick={() => handleLogout(stompClient, setUser, navigate)}>Logout</Button>
  )
}

export default LogoutButton