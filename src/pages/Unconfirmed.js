import React from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuth from "../hooks/useAuth";


export default function Unconfirmed() {
  const {setUser} = useAuth();
    const navigate = useNavigate();
    
    function logout() {
      setUser(null);
      navigate("/authenticate")
    }
  return (
    <>
        <h1>Looks like your email has not been confirmed.</h1>
        <h3>Click the link in your email to finish registration!</h3>
        <Button onClick={logout}>Logout</Button>
    </>

  )
}
