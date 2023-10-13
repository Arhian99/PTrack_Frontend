import React from 'react'
import { useEffect, useState, useMemo} from 'react'
import { Container } from 'react-bootstrap'
import useLoading from '../hooks/useLoading';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import Loading from './Loading';
import SockJsClient from 'react-stomp';


const SOCKET_URL = 'http://localhost:8080/ws';

function Visits() {
    const {user}= useAuth();
    const {loading, setLoading} = useLoading();
    const [visits, setVisits] = useState();
    const [message, setMessage] = useState();

    let onConnected = () => {
        console.log("CONNECTED!");
    };

    let onMessageRecieved = () => {
        setMessage(message);
    }

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
  return (
    <>
    <SockJsClient 
        url={SOCKET_URL}
        topics={['/topic/currentVisit']}
        onConnect={onConnected}
        onDisconnect={console.log("Disconnected!")}
        onMessage={msg => onMessageRecieved(msg)}
        debug={false}
    />
    loading ? <Loading/> :
    <Container>
        <h1>Visits</h1>
        <h3>{message}</h3>
    </Container>
    </>
  )
}

export default Visits