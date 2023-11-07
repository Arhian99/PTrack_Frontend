import React, {useEffect, useState} from 'react'
import {Button, Container, Card, Accordion, Spinner, Alert } from 'react-bootstrap'
import useAuth from '../hooks/useAuth';
import { NavLink } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { useQueryClient } from '@tanstack/react-query';
import { updatePtVisits } from '../api/dataFetching';

function Visits() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [visitDataState, setVisitDataState] = useState(queryClient.getQueryState(['allPtVisits', user?.user?.username]));
    useEffect(()=> {updatePtVisits(visitDataState, setVisitDataState, queryClient, user)}, [visitDataState]);

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
                            {
                                visitDataState?.status==="loading" ? <Spinner animation="border" variant="success" /> :
                                visitDataState?.status==="error" ? <Alert variant='danger'>{visitDataState.error}</Alert> :
                                visitDataState?.status==="success" && visitDataState?.data?.data.length === 0 ?
                                    <>
                                        You have no past visits.
                                        <NavLink to="/patient/visits/new" className='d-block btn btn-dark text-white font-weight-bold py-2 my-2'>New Visit</NavLink>
                                    </> 
                                    : 
                                    visitDataState?.data?.data.map((visit) => {
                                        return (
                                            <Card key={visit?.id}>
                                                <Card.Body>
                                                    <Card.Text>
                                                        Doctor: {visit?.doctorUsername}<br />
                                                        Location: {visit?.locationName}<br />
                                                        Status: {visit?.status}<br />
                                                        Date: {visit?.date}
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

                <BackButton />

            </Container>
        
    )
}

export default Visits;