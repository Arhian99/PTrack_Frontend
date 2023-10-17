import React from 'react'
import { useEffect, useState, useMemo} from 'react'
import { Container, Button, Card, Accordion } from 'react-bootstrap'
import useLoading from '../hooks/useLoading';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import Loading from './Loading';
import SockJS from 'sockjs-client'
import {Client} from '@stomp/stompjs'
import { NavLink } from 'react-router-dom';


const SOCKET_URL = 'http://localhost:8080/ws';
let stompClient = null;
let topicCurrentVisitSubscription = null;

/* TODO - Handle errors for getVisits() function and render error message */
/* TODO - Move ws connection code to corresponding components */
function Visits() {
    const {user}= useAuth();
    const {loading, setLoading} = useLoading();
    const [visits, setVisits] = useState(null);
    const [message, setMessage] = useState("no messages");

    const headers = useMemo(() => ({
        Authorization: 'Bearer '.concat(user?.jwt),
        'Content-Type': 'application/json',
        withCredentials: true

    }), [user?.jwt])

    useEffect(() => {
        setLoading(true);
        fetchVisits();
        setLoading(false);
    }, [])
    
    async function fetchVisits(){
        try {
            const response = await axios.get(
                "/api/visits/all",
                {headers}
            )
            setVisits(response.data)

        } catch (error) {
            console.log(error);
        }
    }

    function handshake(){
        stompClient = new Client({
            webSocketFactory: () => new SockJS(SOCKET_URL),
            connectHeaders: {
                "Authorization": "Bearer ".concat(user?.jwt),
                // "User": `${user?.user?.username}`
            },
            debug: (msg) => console.log(msg), // comment out in production,
            reconnectDelay: 300000,
            onConnect: () => {
                console.log("Connected");
                topicCurrentVisitSubscription = stompClient.subscribe(
                    `/user/queue/currentVisit`,
                    (message) => {
                        console.log(`Recieved: ${message}`);
                        setMessage(message.body);
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
    loading ? <Loading/> :
    <Container>
        <h1>Visits</h1>
        <Accordion defaultActiveKey="current" className='my-4'>
            <Accordion.Item eventKey="current">
                <Accordion.Header>Current Visit</Accordion.Header>
                <Accordion.Body>
                    {
                        user?.user?.isInVisit ? 
                        <Card>
                            <Card.Body>
                                <Card.Text>
                                    Doctor: {user?.user?.currentVisit?.doctor?.username}<br/>
                                    Location: {user?.user?.currentVisit?.location?.name}<br/>
                                    Status: {user?.user?.currentVisit?.status}<br/>
                                    Date: {user?.user?.currentVisit?.date}
                                </Card.Text>

                                <NavLink to="/patient/visits/current" className='d-block btn btn-dark text-white font-weight-bold py-2 my-2'>See Visit</NavLink>

                            </Card.Body>
                        </Card>
                        : 
                        <>
                            You are not currently in a visit.
                            <NavLink to="/patient/visits/new" className='d-block btn btn-dark text-white font-weight-bold py-2 my-2'>New Visit</NavLink>
                        </>
                    }
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey='past'>
            <Accordion.Header>Past Visits</Accordion.Header>
                <Accordion.Body>
                    {
                        visits?.length === 0 ? 
                        <>
                            You have no past visits.
                            <NavLink to="/patient/visits/new" className='d-block btn btn-dark text-white font-weight-bold py-2 my-2'>New Visit</NavLink>
                        </> : 
                        visits?.map((visit) => {
                            return(
                                <Card>
                                    <Card.Body>
                                        <Card.Text>
                                            Doctor: {visit?.doctor?.username}<br/>
                                            Location: {visit?.location?.name}<br/>
                                            Status: {visit?.status}<br/>
                                            Date: {visit?.data}
                                        </Card.Text>
            
                                        <NavLink to={`/patient/visits/${visit?.id}`} className='d-block btn btn-dark text-white font-weight-bold py-2 my-2'>See Visit</NavLink>
            
                                    </Card.Body>
                                </Card>
                            )
                        })
                    }
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>


        














        {/* <Button onClick={handshake}>Connect</Button>
        <Button onClick={() => {
            stompClient?.publish({
                destination: "/app/currentVisit",
                // headers: {"Authorization": "Bearer ".concat(user?.jwt)},
                body: JSON.stringify({
                    "from": `${user?.user?.username}`,
                    "to": "DoctorOne"
                })
            })
        }}>Send Message</Button>
        <h3>Messages:</h3>
        <h5>{message}</h5> */}
    </Container>

  )
}

export default Visits;