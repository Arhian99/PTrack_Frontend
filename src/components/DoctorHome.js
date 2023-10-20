import React, { useEffect, useState, useCallback } from 'react'
import useAuth from '../hooks/useAuth'
import { Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';



/*
This component is rendered when the person logged in is a doctor
*/
function DoctorHome() {
    const {user} = useAuth();
    useEffect(() => console.log(user), [])


    return (
        <Container className="d-flex flex-column mx-auto vw-75 align-items-center">
            <Container className="p-0 m-0 d-flex flex-column">
                <h1 className='my-2'>Welcome Dr. {user?.doctor?.username}</h1>
                <NavLink to="/doctor/lounge" className='btn btn-dark text-white font-weight-bold py-2 my-2'>Doctor Lounge</NavLink>
                <NavLink to="/doctor/checkIn" className='btn btn-dark text-white font-weight-bold py-2 my-2'>Check In</NavLink>
                <NavLink to="/doctor/visits" className='btn btn-dark text-white font-weight-bold py-2 my-2'>Visits</NavLink>
            </Container>
            
        </Container>
    )
}

export default DoctorHome