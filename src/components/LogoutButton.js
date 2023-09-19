import React from 'react'
import { Button } from 'react-bootstrap'
import useAuth from '../hooks/useAuth'

function LogoutButton() {
    const {setUser} = useAuth();

  return (
    <Button onClick={() => {
      setUser(null);
      window.localStorage.setItem('user', null)
      }}
    >Logout</Button>
  )
}

export default LogoutButton