import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Home() {
  const {user, setUser } = useAuth();

  console.log(user);
  return (
    <div>
        <h1>Welcome {user?._user?.username}</h1>
        <ul>
          <li><NavLink to="/doctor" >Doctor Lounge</NavLink></li>
          <li><NavLink to="/patient" >Patient Lounge</NavLink></li>
        </ul>
        <Button onClick={() => setUser(null)}>Logout</Button>
    </div>
    
  )
}
