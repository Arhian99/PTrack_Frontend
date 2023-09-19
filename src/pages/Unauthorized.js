import React from 'react'
import { Container } from 'react-bootstrap';
import BackButton from '../components/BackButton';

/* Users get redirected here when they try to access resources/pages to which they don't have permissions for. */
export default function Unauthorized() {
  return (
    <Container>
        <h1> Unauthorized :( </h1>
        <BackButton isUnauthorized={true}/>
    </Container>

  )
}
