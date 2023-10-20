import React from 'react'
import useAuth from '../hooks/useAuth'
import { Button, Container, Card } from 'react-bootstrap';

function Visit() {
  const{user} = useAuth();

  return (
    <Container>
    <h1>Visit</h1>

    <Card>
      <Card.Body>
        <Card.Title>Visit @ {user?.user?.currentVisit?.location?.name}</Card.Title>
        <Card.Text>
          Doctor: {user?.user?.currentVisit?.doctor?.username} <br />
          Location: {user?.user?.currentVisit?.location?.name} <br />
          Status: {user?.user?.currentVisit?.status}
        </Card.Text>
        <Button>See Docs</Button> <Button>Send Docs</Button>
      </Card.Body>
    </Card>
  </Container>
  )
}

export default Visit