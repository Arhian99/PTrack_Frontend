import React, {useEffect, useState} from 'react'
import { Container, Button, Card, Spinner, Alert } from 'react-bootstrap'
import useAuth from '../hooks/useAuth'
import useStomp from '../hooks/useStomp';
import BackButton from '../components/BackButton';
import { acceptVisitStomp, declineVisitStomp, updateDocVisits } from '../api/dataFetching';
import { useQueryClient } from '@tanstack/react-query';
import { NavLink } from 'react-router-dom';

function DoctorVisits() {
    const {user} = useAuth();
    const stompClient= useStomp();
    const queryClient = useQueryClient();
    const [visitDataState, setVisitDataState] = useState(queryClient.getQueryState(['allDocVisits', user?.doctor?.username]))
    useEffect(() => {updateDocVisits(visitDataState, setVisitDataState, queryClient, user)}, [visitDataState])
    
    return (
        <Container >
            <h1>Doctor Visits</h1>
            <Container>
                <h3>Current Visits: </h3>
                {user?.doctor?.currentVisits === null || user?.doctor?.currentVisits.length === 0 ? <>You have no current visits.</> :
                    
                user?.doctor?.currentVisits?.map((visit) => {
                    return(
                        <Card key={visit?.id}>
                            <Card.Body>
                                <Card.Text>
                                    Patient: {visit?.patientUsername}<br />
                                    Location: {visit?.locationName}<br />
                                    Status: {visit?.status}<br />
                                    Date: {visit?.date}
                                </Card.Text>
                    
                                <Button onClick={async () => await acceptVisitStomp(queryClient, setVisitDataState, stompClient, user, visit)}>Accept</Button>
                                <Button onClick={async () => await declineVisitStomp(queryClient, setVisitDataState, stompClient, user, visit)} >Decline</Button>
                            </Card.Body>
                        </Card>
                    )
                })}
            </Container>

            <Container>
                <h3>Past Visits:</h3>
                {
                    visitDataState?.status==="loading" ? <Spinner animation="border" variant="success" /> :
                    visitDataState?.status==="error" ? <Alert variant='danger'>{visitDataState.error}</Alert> :
                    visitDataState?.status==="success" && visitDataState?.data?.data.length === 0 ?
                    <>
                        You have no past visits.
                    </>
                    :
                    visitDataState?.data?.data.map((visit) => {
                        return (
                            <Card key={visit?.id}>
                                <Card.Body>
                                    <Card.Text>
                                        Patient: {visit?.patientUsername}<br />
                                        Location: {visit?.locationName}<br />
                                        Status: {visit?.status}<br />
                                        Date: {visit?.date}
                                    </Card.Text>

                                    <NavLink to={`/doctor/visits/${visit?.id}`} className='d-block btn btn-dark text-white font-weight-bold py-2 my-2'>See Visit</NavLink>
                                </Card.Body>
                            </Card> 
                        )
                    })                 
                }
            </Container>
            <BackButton />
        </Container>
    )
}

export default DoctorVisits