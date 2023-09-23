import React, { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import useAuth from '../hooks/useAuth'
import { getRole } from '../utils/utilities';

function CheckedIn({setSuccessMessage}) {
    const{user} = useAuth();
    function getUserMessage(user) {
        if(getRole(user) === 'ROLE_USER') {
            return (
                `${user?.user.username} is checked in!`
            )
        } else if(getRole(user) === 'ROLE_DOCTOR') {
            return (
                `Dr. ${user?.doctor.username} is checked in!`
            )
        }
    }



    useEffect(() => {
        setTimeout(() => setSuccessMessage(null), 5000)
    }, [])



  return (
    <Container fluid className='m-0 p-0'>
        <h1>{getUserMessage(user)}</h1>
    </Container>
  )
}

export default CheckedIn