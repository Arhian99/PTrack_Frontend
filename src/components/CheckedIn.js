import React, { useCallback, useEffect } from 'react'
import { Button, Container } from 'react-bootstrap'
import useAuth from '../hooks/useAuth'
import { getRole } from '../utils/utilities';
import axios from '../api/axios';

function CheckedIn({setLoading, setSuccessMessage, setErrorMessage, headers, setIsCheckedIn}) {
    const{user, setUser} = useAuth();
    
    useEffect(() => {
        setTimeout(() => {
            setSuccessMessage(null);
            // setWarningMessage(null);
            setErrorMessage(null);
        }, 8500)
    }, [])

    async function handleCheckOut(){
        setLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        try {
            const response = await axios.post(
                "/api/locations/checkOut",
                {
                    "email": user?.doctor.email,
                    "jwt": user?.jwt,
                    "role": getRole(user)
                },
                { headers }
            )
            setLoading(false);
            if(response.status === 200){
                console.log("Successful Check Out!")
                setUser(response.data);
                setIsCheckedIn(false);
                setSuccessMessage("Check Out Successful!");
            }

        } catch(error){
            setLoading(false);
            setErrorMessage(error.response.data);
        }
    }

  return (
    <Container fluid className='m-0 p-0'>
        <h1>You are Checked in @ {user?.doctor?.currentLocation?.name}</h1>
        <Button onClick={handleCheckOut}>Check Out</Button>
    </Container>
  )
}

export default CheckedIn