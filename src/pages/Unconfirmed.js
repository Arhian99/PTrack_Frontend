import React from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from "../hooks/useAuth";


export default function Unconfirmed() {
  const {user, setUser} = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // provided by react router, returns location object
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
