import React, { useCallback } from 'react'
import { useEffect, useState, useMemo } from 'react'
import { Container, Button, Card, Accordion, Spinner } from 'react-bootstrap'
import useLoading from '../hooks/useLoading';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import Loading from './Loading';
import { NavLink } from 'react-router-dom';


/* TODO - Handle errors for getVisits() function and render error message, add Spinner and loadingVisits state */
function Visits() {
    const { user } = useAuth();
    const { loading, setLoading } = useLoading();
    const [visits, setVisits] = useState(null);

    const headers = useMemo(() => ({
        Authorization: 'Bearer '.concat(user?.jwt),
        'Content-Type': 'application/json',
        withCredentials: true

    }), [user?.jwt])

    useEffect(() => {
        fetchVisits();
        console.log(visits);
    }, [])

    async function fetchVisits() {
        try {
            setLoading(true);
            const response = await axios.get(
                "/api/visits/byPatient?patient=".concat(user?.user?.username),
                { headers }
            )
            console.log(response.data)
            setVisits(response.data)
            setLoading(false)
            console.log(visits)
        } catch (error) {
            console.log(error);
        }
    };

    return ( 
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
                                                Doctor: {user?.user?.currentVisit?.doctorUsername}<br />
                                                Location: {user?.user?.currentVisit?.locationName}<br />
                                                Status: {user?.user?.currentVisit?.status}<br />
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
                            {   loading ? <Spinner animation="border" variant="success" /> :
                                visits?.length === 0 ?
                                    <>
                                        You have no past visits.
                                        <NavLink to="/patient/visits/new" className='d-block btn btn-dark text-white font-weight-bold py-2 my-2'>New Visit</NavLink>
                                    </> 
                                    : 
                                    visits?.map((visit) => {
                                        return (
                                            <Card key={visit?.id.timestamp}>
                                                <Card.Body>
                                                    <Card.Text>
                                                        Doctor: {visit?.doctorUsername}<br />
                                                        Location: {visit?.locationName}<br />
                                                        Status: {visit?.status}<br />
                                                        Date: {visit?.date}
                                                    </Card.Text>

                                                    <NavLink to={`/patient/visits/${visit?.id.timestamp}`} className='d-block btn btn-dark text-white font-weight-bold py-2 my-2'>See Visit</NavLink>
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