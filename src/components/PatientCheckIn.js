import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import axios from '../api/axios';
import { getRole } from '../utils/utilities';
import { Form, Button } from 'react-bootstrap';

function PatientCheckIn({user, setLoading, headers, locations, errorMessage, setErrorMessage }) {
    const[docsAtLocation, setDocsAtLocation] = useState();

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
                    console.log("Successful Check In!")
                    console.log(response)
                }
                
            } catch(error) {
                setLoading(false)
                console.log(error)
            }
        }
    })

    useEffect(() => {
        async function getDoctors(){
            try {
                const response = await axios.get(
                    "/api/locations/activeDoctors?location_name="+formik.values.location,
                    { headers }
                )
    
                console.log(response);
                setDocsAtLocation(response.data);
    
            } catch(error){
                console.log(error)
            }
        }

        getDoctors();
    }, [formik.values.location])

    return (
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
                
                <Form.Group>
                    <Form.Label>Doctor: </Form.Label>
                    <Form.Select
                        name='doctor'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.doctor}
                        >
                            <option>Select a Doctor</option>
                            {docsAtLocation?.map(doc => <option value={doc.username} key={doc.username}>{doc.username}</option>)}
                    </Form.Select>
                    <Form.Text className='text-danger'>
                        {formik.touched.doctor && formik.errors.doctor ? (
                            <div className='text-danger'>{formik.errors.doctor}</div>
                        ) : null}
                    </Form.Text>
                </Form.Group>
            
                <Button type="submit" className='d-block my-3'>Submit</Button>
            </Form>
    )
}

export default PatientCheckIn