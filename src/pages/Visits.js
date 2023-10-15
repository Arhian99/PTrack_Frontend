import React from 'react'
import { useEffect, useState, useMemo} from 'react'
import { Container, Button } from 'react-bootstrap'
import useLoading from '../hooks/useLoading';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import Loading from './Loading';
import SockJS from 'sockjs-client'
import {Client} from '@stomp/stompjs'


const SOCKET_URL = 'http://localhost:8080/ws';
let stompClient = null;
let topicCurrentVisitSubscription = null;

function Visits() {
    const {user}= useAuth();
    const {loading, setLoading} = useLoading();
    const [visits, setVisits] = useState();
    const [message, setMessage] = useState("no messages");

    const headers = useMemo(() => ({
        Authorization: 'Bearer '.concat(user?.jwt),
        'Content-Type': 'application/json',
        withCredentials: true

    }), [user?.jwt])

    useEffect(() => {
        setLoading(true);
        getVisits();
        setLoading(false);
    }, [])
    
    async function getVisits(){
        try {
            const response = await axios.get(
                "/api/visits/all",
                {headers}
            )
            console.log(response)

            setVisits(response.data)

        } catch (error) {
            console.log(error);
        }
    }

    function handshake(){
        stompClient = new Client({
            webSocketFactory: () => new SockJS(SOCKET_URL),
            connectHeaders: {"Authorization": "Bearer ".concat(user?.jwt)},
            debug: (msg) => console.log(msg), // comment out in production,
            reconnectDelay: 300000,
            onConnect: () => {
                console.log("Connected");
                topicCurrentVisitSubscription = stompClient.subscribe(
                    "/user/queue/currentVisit",
                    (message) => {
                        console.log(`Recieved: ${message}`);
                        setMessage(message.body);
                    }, 
                    {"Authorization": "Bearer ".concat(user?.jwt)} // check if possible to remove this header after initial handshake (configure backend) --> 
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
    loading ? <Loading/> :
    <Container>
        <h1>Visits</h1>
        <Button onClick={handshake}>Connect</Button>
        <Button onClick={() => {
            stompClient?.publish({
                destination: "/app/currentVisit",
                // headers: {"Authorization": "Bearer ".concat(user?.jwt)},
                body: JSON.stringify({
                    "from": `${user?.user?.username}`
                })
            })
        }}>Send Message</Button>
        <h3>Messages:</h3>
        <h5>{message}</h5>
    </Container>

  )
}

export default Visits;