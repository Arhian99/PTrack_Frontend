import React from 'react';
import { NavLink } from 'react-router-dom';
import {  Container} from 'react-bootstrap';
import useAuth from '../hooks/useAuth';
import PatientHome from '../components/PatientHome';
import DoctorHome from '../components/DoctorHome';

/*
This is the Home Page and renders either the PatientHome or DoctorHome 
component depending on the role of the user.
*/
export default function Home() {
  const {user} = useAuth();
  console.log(user)
  return (
    <Container fluid className='p-0'>
      {user?.user?.roles[0].name === 'ROLE_USER' ? <PatientHome /> : <DoctorHome />}
    </Container>
  )
}