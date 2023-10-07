import React, { useEffect, useState } from 'react'
import BackButton from '../components/BackButton'
import { Alert, Container } from 'react-bootstrap'
import Loading from '../pages/Loading'
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import { getRole } from '../utils/utilities';
import DoctorCheckIn from '../components/DoctorCheckIn';
import PatientCheckIn from '../components/BeginVisit';
import CheckedIn from '../components/CheckedIn';

function CheckIn() {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null);
    const[warningMessage, setWarningMessage] = useState(null);
    const[successMessage, setSuccessMessage] = useState(null);
    const [locations, setLocations] = useState([]);

    const headers ={
        'Authorization': 'Bearer '.concat(user?.jwt),
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
            setLoading(false)

            // 401 --> unauthorized
            if(error.response.status === 401){
                setErrorMessage("Something went wrong, re-authenticate and try again.")
            } else {
                setErrorMessage(error.response.data);
            }
        }
    }
    
    useEffect(() => getLocations, [])



    return (
        loading ? <Loading /> : 
        <Container className='mt-3'>
            <h1>Check In</h1>
            {errorMessage!== null ? <Alert variant='danger'>{`${errorMessage}`}</Alert> : null}
            {warningMessage !== null ? <Alert variant='warning'>{warningMessage}</Alert> : null }
            {successMessage!== null ? <Alert variant='success'>{successMessage}</Alert> : null }
            <DoctorCheckIn 
                setLoading={setLoading} 
                headers={headers}
                locations={locations}
                setErrorMessage={setErrorMessage}
                setSuccessMessage={setSuccessMessage}
            />
            <BackButton />  
        </Container>
    )
}

export default CheckIn