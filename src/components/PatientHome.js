import React, {useEffect} from 'react'
import { Container } from 'react-bootstrap'
import useAuth from '../hooks/useAuth'
import { NavLink } from 'react-router-dom';

/*
This component is rendered when the person logged in is a patient
*/
export default function PatientHome() {
    const {user} = useAuth();
    useEffect(() => console.log(user), [])
    return (
        <Container className="d-flex flex-column mx-auto vw-75 align-items-center">
            <Container className="p-0 m-0 d-flex flex-column">
                <h1 className='my-2'>Welcome {user?.user?.username}</h1>
                <NavLink to="/patient/lounge" className='btn btn-dark text-white font-weight-bold py-2 my-2'>Patient Lounge</NavLink>
                <NavLink to="/patient/visits" className='btn btn-dark text-white font-weight-bold py-2 my-2'>My Visits</NavLink>
            </Container>
        </Container>
    )
}
