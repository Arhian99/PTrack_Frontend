import React from 'react'
import { Button } from 'react-bootstrap'
import useAuth from '../hooks/useAuth'

function LogoutButton() {
    const {setUser} = useAuth();
    function handleLogout() {
      setUser(null);
      window.localStorage.setItem('user', null)
    }
  return (
    <Button onClick={handleLogout}>Logout</Button>
  )
}

export default LogoutButton