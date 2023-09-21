import React from 'react';
import { NavLink } from 'react-router-dom';
import {  Container} from 'react-bootstrap';
import useAuth from '../hooks/useAuth';
import PatientHome from '../components/PatientHome';
import DoctorHome from '../components/DoctorHome';
import { getRole } from '../utils/utilities';

/*
This is the Home Page and renders either the PatientHome or DoctorHome 
component depending on the role of the user.
*/
export default function Home() {
  const {user} = useAuth();
  console.log(user)
  console.log(user?.user)
  console.log(user?.doctor)

  return (
    <Container fluid className='p-0'>
      {getRole(user) === 'ROLE_USER' ? <PatientHome /> : <DoctorHome />}
    </Container>
  )
}