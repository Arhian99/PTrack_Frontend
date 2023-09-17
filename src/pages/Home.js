import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import useAuth from '../hooks/useAuth';

export default function Home() {
  const {user, setUser } = useAuth();
  console.log(user)

  return (
    <Container>
        <h1>Welcome {user?.user.username}</h1>
        <ul>
          <li><NavLink to="/doctor" >Doctor Lounge</NavLink></li>
          <li><NavLink to="/patient" >Patient Lounge</NavLink></li>
        </ul>
        <Button onClick={() => setUser(null)}>Logout</Button>
    </Container>
    
  )
}
