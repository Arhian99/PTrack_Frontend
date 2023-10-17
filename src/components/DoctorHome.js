import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import { Container, Button} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const SOCKET_URL = 'http://localhost:8080/ws';
let stompClient = null;
let topicCurrentVisitSubscription = null;
/*
This component is rendered when the person logged in is a doctor
*/
function DoctorHome() {
    const {user} = useAuth();
    const[message, setMessage] = useState("no messages");

    useEffect(() => console.log(user), [])
    function handshake() {
        stompClient = new Client({
            webSocketFactory: () => new SockJS(SOCKET_URL),
            connectHeaders: {
                "Authorization": "Bearer ".concat(user?.jwt),
                // "User": `${user?.doctor?.username}`
            },
            debug: (msg) => console.log(msg), // comment out in production,
            reconnectDelay: 300000,
            onConnect: () => {
                console.log("Connected");
                topicCurrentVisitSubscription = stompClient.subscribe(
                    `/user/queue/currentVisit`,
                    (msg) => {
                        console.log(`Recieved: ${msg}`);
                        setMessage(msg.body);
                    }, 
                    // {"Authorization": "Bearer ".concat(user?.jwt)} // check if possible to remove this header after initial handshake (configure backend) --> 
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
    }
    
    return (
        <Container className="d-flex flex-column mx-auto vw-75 align-items-center">
            <Container className="p-0 m-0 d-flex flex-column">
                <h1 className='my-2'>Welcome Dr. {user?.doctor?.username}</h1>
                <NavLink to="/doctor/lounge" className='btn btn-dark text-white font-weight-bold py-2 my-2'>Doctor Lounge</NavLink>
                <NavLink to="/doctor/checkIn" className='btn btn-dark text-white font-weight-bold py-2 my-2'>Check In</NavLink>
            </Container>
            <Container>
                <Button onClick={handshake}>Connect</Button>
                <Button onClick={() => {
                    stompClient?.publish({
                        destination: "/app/currentVisit",
                        body: JSON.stringify({
                            "from": `${user?.doctor?.username}`,
                            "to": "Arhian99"
                        })
                    })
                }}>Send Message</Button>
                <h3>Messages:</h3>
                <h5>{message}</h5>
            </Container>
        </Container>
    )
}

export default DoctorHome