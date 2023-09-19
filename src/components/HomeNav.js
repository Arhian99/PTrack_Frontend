import React from 'react'
import { Navbar, Container } from 'react-bootstrap'
import profileImg from "../assets/logo192.png"

function HomeNav() {
  return (
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
        </Container>
    </Navbar>
  )
}

export default HomeNav