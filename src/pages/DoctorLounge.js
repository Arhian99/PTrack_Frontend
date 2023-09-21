import React, {useEffect} from 'react'
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import BackButton from '../components/BackButton';


/* 
This component contains all the profile information for Doctors
*/
export default function DoctorLounge() {
    const {user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(user?.doctor?.roles[0].name !== "ROLE_DOCTOR") {
          navigate("/unauthorized")
        }
    }, [])

  return (
    <Container>
      <h1>Welcome to the Doctor's Lounge</h1>
      <h3>Your Credentials:</h3>
      <ul>
        <li>Username: {user?.doctor?.username}</li>
        <li>Email: {user?.doctor?.email}</li>
        <li>Role: {user?.doctor?.roles[0].name}</li>
      </ul>
      <BackButton />
    </Container>
  )
}
