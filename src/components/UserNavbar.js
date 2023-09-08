import React from 'react'
import { Container, Image, Navbar } from 'react-bootstrap'

export default function UserNavbar() {
  return (
    <Navbar bg="dark" variant='dark'>
        <Container>
            <Navbar.Brand>
                <Image src='' 
                       width="50" 
                       height="50" 
                       className='d-inline-block'
                       roundedCircle />
            </Navbar.Brand>
        </Container>
    </Navbar>
  )
}