import React, { useEffect, useState, useMemo, useCallback } from 'react'
import BackButton from '../components/BackButton'
import { Alert, Container } from 'react-bootstrap'
import Loading from '../pages/Loading'
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import { getRole } from '../utils/utilities';
import DoctorCheckIn from '../components/DoctorCheckIn';
import PatientCheckIn from '../components/BeginVisit';
import CheckedIn from '../components/CheckedIn';
import BeginVisit from '../components/BeginVisit';
import useLoading from '../hooks/useLoading';

function NewVisit() {
    const {user} = useAuth();
    const {loading, setLoading} = useLoading();
    const [errorMessage, setErrorMessage] = useState(null);
    const[warningMessage, setWarningMessage] = useState(null);
    const[successMessage, setSuccessMessage] = useState(null);
    const [locations, setLocations] = useState([]);
    const headers = useMemo(() => ({
        Authorization: 'Bearer '.concat(user?.jwt),
        'Content-Type': 'application/json',
        withCredentials: true

    }), [user?.jwt])

    const fetchLocations = useCallback((async () =>{
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
            console.log(error)
            // 401 --> unauthorized
            if(error.response.status === 401){
                setErrorMessage("Something went wrong, re-authenticate and try again.")
            } else {
                setErrorMessage(error.response.data);
            }
        }
    }), [headers, user]);
    
    useEffect(() => {
        setLoading(true);
        fetchLocations();
        setLoading(false);

        setTimeout(() => {
            setSuccessMessage(null);
            setWarningMessage(null);
            setErrorMessage(null);
        }, 8500)
    }, [])

    return (
        loading ? <Loading /> : 
        <Container className='mt-3'>
            <h1>New Visit</h1>
            {errorMessage!== null ? <Alert variant='danger'>{errorMessage}</Alert> : null}
            {warningMessage !== null ? <Alert variant='warning'>{warningMessage}</Alert> : null }
            {successMessage!== null ? <Alert variant='success'>{successMessage}</Alert> : null }

            <BeginVisit
                headers={headers}
                locations={locations}
                setErrorMessage={setErrorMessage}
                setWarningMessage={setWarningMessage}
                setSuccessMessage={setSuccessMessage}
            />

            <BackButton />  
        </Container>
    )
}

export default NewVisit