import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import axios from '../api/axios';
import { getRole } from '../utils/utilities';
import { Form, Button, Spinner } from 'react-bootstrap';

function BeginVisit({user, setLoading, headers, locations, setErrorMessage, setWarningMessage, setSuccessMessage }) {
    const[docsAtLocation, setDocsAtLocation] = useState();
    const[loadingDocs, setLoadingDocs] = useState(false);

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
            console.log(values)
            try {
                setLoading(true);
                setErrorMessage(null);
                setWarningMessage(null);
                setSuccessMessage(null);
                
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
                    console.log("Successful Check In!");
                    console.log(response);
                    user.user.isCheckedIn = true;
                    setSuccessMessage("Check In Successful!");
                }
                
            } catch(error) {
                setLoading(false)
                console.log(error)

                if(error.response.status === 401){
                    setErrorMessage("Something went wrong, re-authenticate and try again.")
                } else {
                    setErrorMessage(error.response.data);
                }

            }
        }
    })

    async function getDoctors(){
        setLoadingDocs(true);
        setErrorMessage(null);
        setWarningMessage(null);

        try {
            const response = await axios.get(
                "/api/locations/activeDoctors?location_name="+formik.values.location,
                { headers }
            )
        
            setDocsAtLocation(response.data);
            setLoadingDocs(false);

            if(response.data[0] === undefined){
                setWarningMessage("No doctors currently checked in at the specified location. Choose another location or try again later.")
            }


        } catch(error){
            setLoadingDocs(false);
            console.log(error);
    
            if(error.response.status === 401){
                setErrorMessage("Something went wrong, re-authenticate and try again.")
            } else {
                setErrorMessage(error.response.data);
            }
        }
    }

    useEffect(() => {
        if(formik.values.location !== ""){
            getDoctors();
        }
        
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
                            {locations?.map((location) => <option value={location.name} key={location.name}>{location.name}</option>)}
                    </Form.Select>
                    <Form.Text className='text-danger'>
                        {formik.touched.location && formik.errors.location ? (
                            <div className='text-danger'>{formik.errors.location}</div>
                        ) : null}
                    </Form.Text>
            </Form.Group>
                
                {
                    loadingDocs ? <Spinner animation="border" variant="success" />
                    : 
                    <Form.Group>
                        <Form.Label>Doctor: </Form.Label>
                        <Form.Select
                            name='doctor'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.doctor}
                            >
                            <option>Select a Doctor</option>
                            { docsAtLocation?.map(doc => <option value={doc?.username} key={doc?.username}>{doc?.username}</option>) }
                        </Form.Select>
                        <Form.Text className='text-danger'>
                            {formik.touched.doctor && formik.errors.doctor ? (
                                <div className='text-danger'>{formik.errors.doctor}</div>
                            ) : null}
                        </Form.Text>
                    </Form.Group>
                }

                <Button type="submit" className='d-block my-3' disabled={loadingDocs} >Submit</Button>
        </Form>
    )
}

export default BeginVisit;