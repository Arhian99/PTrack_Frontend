import React from 'react'
import { Container, Button, Card } from 'react-bootstrap'
import useAuth from '../hooks/useAuth'
import StompMessage from '../DTOs/StompMessage';
import useStomp from '../hooks/useStomp';
import BackButton from '../components/BackButton';

function DoctorVisits() {
    const {user} = useAuth();
    const stompClient= useStomp();
    
  return (
    <Container >
        <h1>Doctor Visits</h1>
        <Container>
                <h3>Visits: </h3>
                {user?.doctor?.currentVisits === null || user?.doctor?.currentVisits.length === 0 ? <h4>No current visits</h4> :
                
                user?.doctor?.currentVisits?.map((visit) => {
                    return(
                        <Card key={visit?.id.timestamp}>
                            <Card.Body>
                                <Card.Text>
                                    Patient: {visit?.patientUsername}<br />
                                    Location: {visit?.locationName}<br />
                                    Status: {visit?.status}<br />
                                    Date: {visit?.date}
                                </Card.Text>
                    
                                <Button onClick={() => {
                                            stompClient.current.publish({
                                                destination: "/app/currentVisit/accept",
                                                body: JSON.stringify(
                                                    new StompMessage(
                                                        "NewVisitResponse",             // messageType
                                                        user?.doctor?.username,         // senderUsername
                                                        visit.patientUsername,          // recipientUsername
                                                        {"visitID": visit.id}           // payload
                                                    )
                                                )
                                            })
                                }} >Accept</Button>

                                <Button onClick={() => {
                                            stompClient.current.publish({
                                                destination: "/app/currentVisit/decline",
                                                body: JSON.stringify(
                                                    new StompMessage(
                                                        "NewVisitResponse",             // messageType
                                                        user?.doctor?.username,         // senderUsername
                                                        visit.patientUsername,          // recipientUsername
                                                        {"visitID": visit.id}           // payload
                                                    )
                                                )
                                            })
                                }} >Decline</Button>
                            </Card.Body>
                        </Card>
                    )

                })}

            </Container>
        
        <BackButton />
    </Container>
  )
}

export default DoctorVisits