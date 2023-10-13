import React from 'react'
import { useEffect, useState, useMemo} from 'react'
import { Container } from 'react-bootstrap'
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
    const [message, setMessage] = useState();

    const headers = useMemo(() => ({
        Authorization: 'Bearer '.concat(user?.jwt),
        'Content-Type': 'application/json',
        withCredentials: true

    }), [user?.jwt])

    useEffect(() => {
        setLoading(true);
        getVisits();
        setLoading(false);
        handshake();
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
            debug: (msg) => console.log(msg)
        });
        // stompClient.webSocketFactory = () => new SockJS(SOCKET_URL);
        // stompClient.connectHeaders = {
        //     "Authorization": "Bearer ".concat(user?.jwt)
        // }

        stompClient.onConnect(() => {
            console.log("Connected!");
            topicCurrentVisitSubscription = stompClient.subscribe(
                "/topic/currentVisit",
                (message) => {
                    console.log(message);
                    setMessage(message.body);
                }, 
                {"Authorization": "Bearer ".concat(user?.jwt)} // check if possible to remove this header after initial handshake (configure backend) --> 
            )
        })

        stompClient.onDisconnect(() => {
            console.log("Disconnected!");
        })

        stompClient.onStompError((msg) => {
            console.log('Broker reported error: ' + msg.headers['message'])
            console.log('Additional details: ' + msg.body);
        })

        console.log(stompClient);
        stompClient.activate();
        // stompClient.connect(
        //     {"Authorization": "Bearer ".concat(user?.jwt)},
        //     function(frame){
        //         console.log('Connected '+frame)
        //         stompClient.subscribe(
        //             'topic/currentVisit', 
        //             function (message){
        //                 console.log(message)
        //                 console.log(message.body)
        //                 setMessage(message.body)
        //             }
        //         )
        //     }
        // )

        // stompClient.onMessage(function (message){
        //     console.log(message)
        //     console.log(message.body)
        //     setMessage(message.body)
        // });
    }
  return (
    loading ? <Loading/> :
    <Container>
        <h1>Visits</h1>
        <h3>{message}</h3>
    </Container>

  )
}

export default Visits;