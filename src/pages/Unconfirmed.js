import React from 'react'
import {Container } from 'react-bootstrap';
import LogoutButton from '../components/LogoutButton';

/* users get redirected to this page when user object isEnabled field equals false */
export default function Unconfirmed() {
  return (
    <Container>
        <h1>Looks like your email has not been confirmed.</h1>
        <h3>Click the link in your email to finish registration!</h3>
        <LogoutButton />
    </Container>

  )
}
