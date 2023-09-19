import React from 'react'
import { Container } from 'react-bootstrap'
import useAuth from '../hooks/useAuth'
import { NavLink } from 'react-router-dom';

/*
This component is rendered when the person logged in is a patient
*/
export default function PatientHome() {
    const {user} = useAuth();

    return (
        <Container>
            <h1>Welcome {user?.user?.username}</h1>
            <NavLink to="/patient">Patient Lounge</NavLink>
        </Container>
    )
}
