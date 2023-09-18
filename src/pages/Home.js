import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import useAuth from '../hooks/useAuth';

export default function Home() {
  const {user, setUser } = useAuth();
  const userRole = user?.user.roles[0].name;

  return (
    <Container>
        <h1>Welcome {user?.user.username}</h1>
        <ul>
          {userRole === "ROLE_DOCTOR" 
            ? <li><NavLink to="/doctor" key={userRole}>Doctor Lounge</NavLink></li>
            : <li><NavLink to="/patient" >Patient Lounge</NavLink></li>
          }
        </ul>
        <Button onClick={() => setUser(null)}>Logout</Button>
    </Container>
  )
}
