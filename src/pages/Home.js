import React from 'react';
import { NavLink } from 'react-router-dom';
import {  Container} from 'react-bootstrap';
import useAuth from '../hooks/useAuth';
import LogoutButton from '../components/LogoutButton';
import HomeNav from '../components/HomeNav';

export default function Home() {
  const {user } = useAuth();
  
  //console.log(JSON.parse(window.localStorage.getItem('user')))
  
  
  return (
    <Container fluid className='p-0'>
      <HomeNav />
      <Container>
        
      <h1>Welcome {user?.user?.username}</h1>
        <ul>
          <li><NavLink to="/doctor" key="1">Doctor Lounge</NavLink></li>
          <li><NavLink to="/patient" key="2">Patient Lounge</NavLink></li>
        </ul>
        
        <LogoutButton />
      </Container>

    </Container>
  )
}