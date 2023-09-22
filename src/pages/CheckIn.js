import React, { useEffect, useState } from 'react'
import BackButton from '../components/BackButton'
import { Alert, Container } from 'react-bootstrap'
import Loading from '../pages/Loading'
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import { getRole } from '../utils/utilities';
import DoctorCheckIn from '../components/DoctorCheckIn';
import PatientCheckIn from '../components/PatientCheckIn';

//TODO: handle backend responses upon form submission
//TODO: Handle backend errors 

function CheckIn() {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [locations, setLocations] = useState([]);
    const userJWT = user?.jwt;
    const headers ={
        'Authorization': 'Bearer '.concat(userJWT),
        'Content-Type': 'application/json',
        withCredentials: true
    }

    async function getLocations(){
        setErrorMessage(null)
        try{
            setLoading(true)
            const response = await axios.get(
                "/api/locations/all",
                { headers },
            )
            setLocations(response.data);
            setLoading(false)

        } catch(error) {
            // 401 --> unauthorized
            setLoading(false)
            console.log(error)

            if(error.response.status === 401){
                setErrorMessage("Something went wrong, re-authenticate and try again.")
            } else {
                setErrorMessage(error.message)
            }
        }
    }
    
    useEffect(() => getLocations, [])



    return (
        loading ? <Loading /> : 
        <Container className='mt-3'>
            <h1>Check In</h1>
            {errorMessage!== null ? <Alert variant='danger'>{`${errorMessage}`}</Alert> : null}
            {getRole(user) === "ROLE_USER" ? 
                <PatientCheckIn 
                    user={user}
                    setLoading={setLoading}
                    headers={headers}
                    locations={locations}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                /> : 
                <DoctorCheckIn 
                    user={user} 
                    setLoading={setLoading} 
                    headers={headers}
                    locations={locations}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage} 
                />
            }
            <BackButton />  
        </Container>
    )
}

export default CheckIn