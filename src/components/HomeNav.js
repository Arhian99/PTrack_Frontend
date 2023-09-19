import React from 'react'
import { Navbar, Container } from 'react-bootstrap'
import profileImg from "../assets/logo192.png"
import LogoutButton from './LogoutButton'
import { Outlet } from 'react-router-dom'

/* This is the navigation bar component, it wraps the protected routes (Home, PatientLounge, DoctorLounge) to ensure it is in all those pages*/
function HomeNav() {
  return (
    <>
    <Navbar className="w-100 bg-black">
        <Container>
            <Navbar.Brand href="/">
                <img
                src={profileImg}
                width="50"
                height="50"
                className="d-inline-block align-top"
                alt="Generic Profile Picture"
                />
            </Navbar.Brand>
            <LogoutButton />
        </Container>
    </Navbar>
    <Outlet />
    </>
  )
}

export default HomeNav