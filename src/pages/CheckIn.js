import React, { useEffect, useState } from 'react'
import BackButton from '../components/BackButton'
import { Button, Container, Form, FormControl } from 'react-bootstrap'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Loading from '../pages/Loading'
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import { getRole } from '../utils/utilities';

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
    const [docsAtLocation, setDocsAtLocation] = useState([]);
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
                { headers }
            )

            setLoading(false)
            setLocations(response.data);
            console.log(response.data);

        } catch(error) {
            setLoading(false)
            console.log(error)
        }
    }

    async function getDoctors(locationName){
        try {
            const response = await axios.get(
                "/api/locations/activeDoctors",
                { headers },
                {
                    "name": locationName
                }
                
            )

            console.log(response);
            setDocsAtLocation(response.data);

        } catch(error){
            console.log(error)
        }
        
    }

    useEffect(() => getLocations, [])

    const formik = useFormik({
        initialValues: {
            location:'',
            doctor:''
        },

        validationSchema: Yup.object({
            location: Yup.string().required('Please select a location.'),
            doctor: Yup.string().required('Please select a doctor.')
        }),

        onSubmit: async (values) => {
            try {
                setLoading(true)
                setErrorMessage(null)
                const response = await axios.post(
                    "/api/locations/checkIn",
                    {
                        "name": values.location,
                        "email": getRole(user) === "ROLE_USER" ? user?.user.email : user?.doctor.email,
                        "role": getRole(user)

                    },
                    { headers }
                )
                
                setLoading(false)

                if(response.status === 200){
                    console.log(response)
                }
                
            } catch(error) {
                setLoading(false)
                console.log(error)
            }
        }
    })


    useEffect(() => {
        getDoctors(formik.values.location);
        console.log(formik)
        console.log(formik.values)
    }, [formik.values.location])

    return (
        loading ? <Loading /> : 
        <Container className='mt-3'>
            <h1>CheckIn</h1>
            <Form onSubmit={formik.handleSubmit} style={{width: "250px"}} className='my-4'>
                <Form.Group className="mb-2" controlId='location'>
                    <Form.Label>Location:</Form.Label>
                    <Form.Select 
                        name="location"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.location}
                        >
                            <option>Select a Location</option>
                            {locations.map((location) => <option value={location.name} key={location.name}>{location.name}</option>)}
                    </Form.Select>
                    <Form.Text className='text-danger'>
                        {formik.touched.location && formik.errors.location ? (
                            <div className='text-danger'>{formik.errors.location}</div>
                        ) : null}
                    </Form.Text>
                </Form.Group>
                
                {getRole(user) === "ROLE_DOCTOR" ? null :
                <Form.Group>
                    <Form.Label>Doctor: </Form.Label>
                    <Form.Select
                        name='doctor'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.doctor}
                        >
                            <option>Select a Doctor</option>
                            {docsAtLocation.map(doc => <option value={doc.username} key={doc.username}>doc.username</option>)}
                    </Form.Select>
                    <Form.Text className='text-danger'>
                        {formik.touched.doctor && formik.errors.doctor ? (
                            <div className='text-danger'>{formik.errors.doctor}</div>
                        ) : null}
                    </Form.Text>
                </Form.Group>
                }
            
                <Button type='submit' className='d-block my-3'>Submit</Button>
            </Form>
            <BackButton />  
        </Container>
    )
}

export default CheckIn