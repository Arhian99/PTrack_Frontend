import React from 'react'
import { Container, Navbar } from 'react-bootstrap'
import UserNavbar from '../components/UserNavbar'
import profileImg from '../assets/svgexport-1.svg'

function Draft() {
  return (
    <Navbar className="bg-black">
        <Container>
          <Navbar.Brand href="#home">
            <img
              src={profileImg}
              width="30"
              height="30"
              className="d-inline-block align-top z-3"
              alt="Generic Profile Picture"
            />
          </Navbar.Brand>
        </Container>
      </Navbar>
  )
}

export default Draft