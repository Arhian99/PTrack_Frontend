import React, { useCallback, useEffect } from 'react'
import { Button, Container } from 'react-bootstrap'
import useAuth from '../hooks/useAuth'
import BackButton from './BackButton';
import {handleCheckOut} from '../api/dataFetching'

function CheckedIn({setLoading, setErrorMessage, setWarningMessage, setSuccessMessage}) {
    const{user, setUser} = useAuth();
    
    /*FIXME - sometimes the code inside setTimeout() is called too soon, sometimes it takes too long, 
    setTimeout() not taking the same time each call */
    useEffect(() => {
        setTimeout(() => {
            setSuccessMessage(null);
            setWarningMessage(null);
            setErrorMessage(null);
        }, 8500)
    }, [])


  return (
    <Container fluid className='m-0 p-0'>
        <h1>You are Checked in @ {user?.doctor?.currentLocation?.name}</h1>
        <Button onClick={() => handleCheckOut(setLoading, setErrorMessage, setSuccessMessage, user, setUser)}>Check Out</Button>
        <BackButton />
    </Container>
  )
}

export default CheckedIn