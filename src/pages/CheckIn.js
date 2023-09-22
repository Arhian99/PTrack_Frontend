import React, { useEffect, useState } from 'react'
import BackButton from '../components/BackButton'
import { Button, Container, Form, FormControl } from 'react-bootstrap'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Loading from '../pages/Loading'
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import { getRole } from '../utils/utilities';
import DoctorCheckIn from '../components/DoctorCheckIn';
import PatientCheckIn from '../components/PatientCheckIn';

//TODO: load doctor options from the activeDoctors set field of the selected location object and render the options in the select dropdown
//TODO: handle backend responses upon form submission
//TODO: Handle backend errors 
// when doctor checks in --> add doctor to activeDoctors field 
// expose API endpoint that takes a location in the request and returns all Doctors in the activeDoctors field for that location




function CheckIn() {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [locations, setLocations] = useState([]);
    //const [docsAtLocation, setDocsAtLocation] = useState([]);
    const userJWT = user?.jwt;
    const headers ={
        'Authorization': 'Bearer '.concat(userJWT),
        'Content-Type': 'application/json',
        withCredentials: true
    }

    async function getLocations(){
        try{
            setLoading(true)
            const response = await axios.get(
                "/api/locations/all",
                { headers },
                {
                    "test": "test"
                }
            )

            setLoading(false)
            setLocations(response.data);
            console.log(response.data);

        } catch(error) {
            setLoading(false)
            console.log(error)
        }
    }
    
    useEffect(() => getLocations, [])



    return (
        loading ? <Loading /> : 
        <Container className='mt-3'>
            <h1>Check In</h1>
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