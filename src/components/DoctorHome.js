import React from 'react'
import useAuth from '../hooks/useAuth'
import { Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

/*
This component is rendered when the person logged in is a doctor
*/
function DoctorHome() {
    const {user} = useAuth();

    return (
        <Container>
            <h1>Welcome {user?.user?.username}</h1>
            <NavLink to="/doctor">Doctor Lounge</NavLink>
        </Container>
    )
}

export default DoctorHome