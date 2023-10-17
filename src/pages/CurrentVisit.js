import React from 'react'
import { Button, Card, Container } from 'react-bootstrap'
import useAuth from '../hooks/useAuth';

function CurrentVisit() {
  const{user} = useAuth();

  return (
    <Container>
      <h1>Current Visit</h1>

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

export default CurrentVisit;