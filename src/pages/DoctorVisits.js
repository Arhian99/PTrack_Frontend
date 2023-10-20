import React,  { useEffect, useState, useCallback } from 'react'
import { Container, Button, Card } from 'react-bootstrap'
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import useAuth from '../hooks/useAuth'


const SOCKET_URL = 'http://localhost:8080/ws';
let stompClient = null;
let topicCurrentVisitSubscription = null;

function DoctorVisits() {
    const {user, setUser} = useAuth();

    const handshake = useCallback(() => {
        stompClient = new Client({
            webSocketFactory: () => new SockJS(SOCKET_URL),
            connectHeaders: {
                "Authorization": "Bearer ".concat(user?.jwt),
            },
            debug: (msg) => console.log(msg), // comment out in production,
            reconnectDelay: 300000,
            onConnect: () => {
                console.log("Connected");
                topicCurrentVisitSubscription = stompClient.subscribe(
                    `/user/queue/currentVisit/new`,
                    (msg) => {
                        console.log(`Recieved:`);
                        console.log(msg.body);
                        console.log(msg.body);
                        setUser({
                            ...user,
                            doctor: JSON.parse(msg.body)
                        })
                    },
                )
            },
            onDisconnect: () => console.log("Disconnected!"),
            onStompError: (msg) => {
                console.log('Broker reported error: ' + msg.headers['message'])
                console.log('Additional details: ' + msg.body);
            }
        });

        // for debugging, delete in production
        console.log(stompClient)
        stompClient.activate();
    }, []);
    
    useEffect(() => {
        handshake();
        console.log(user);
    }, []);


  return (
    <Container >
        <h1>Doctor Visits</h1>
        <Container>
                <Button onClick={() => {
                    stompClient?.publish({
                        destination: "/app/currentVisit/new",
                        body: JSON.stringify({
                            "from": `${user?.doctor?.username}`,
                            "to": "Arhian99"
                        })
                    })
                }}>Send Message</Button>
                <h3>Visits: </h3>
                {user?.doctor?.currentVisits?.map((visit) => {
                    return(
                        <Card key={visit?.id.timestamp}>
                            <Card.Body>
                                <Card.Text>
                                    Patient: {visit?.patientUsername}<br />
                                    Location: {visit?.locationName}<br />
                                    Status: {visit?.status}<br />
                                    Date: {visit?.date}
                                </Card.Text>
                    
                                {/* <NavLink to={`/patient/visits/${visit?.id.timestamp}`} className='d-block btn btn-dark text-white font-weight-bold py-2 my-2'>See Visit</NavLink> */}
                            </Card.Body>
                        </Card>
                    )

                })}

            </Container>
    </Container>
  )
}

export default DoctorVisits