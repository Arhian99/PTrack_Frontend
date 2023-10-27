import React, { useState, useEffect, useCallback } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import axios from '../api/axios';
import { Form, Button, Spinner } from 'react-bootstrap';
import useAuth from '../hooks/useAuth';
import useLoading from '../hooks/useLoading';
import SockJS from 'sockjs-client'
import {Client} from '@stomp/stompjs'
import { useNavigate } from 'react-router-dom';
import VisitDTO from '../DTOs/VisitDTO';
import StompMessage from '../DTOs/StompMessage';
import useStomp from '../hooks/useStomp';



// const SOCKET_URL = 'http://localhost:8080/ws';
// let stompClient = null;
// let topicCurrentVisitSubscription = null;

function NewVisitForm({headers, locations, setErrorMessage, setWarningMessage, setSuccessMessage }) {
    const{user} = useAuth();
    const{setLoading} = useLoading();
    const[docsAtLocation, setDocsAtLocation] = useState();
    const[loadingDocs, setLoadingDocs] = useState(false);
    const navigate = useNavigate();
    const stompClient = useStomp();

    const formik = useFormik({
        initialValues: {
            location:'',
            doctor:''
        },

        validationSchema: Yup.object({
            location: Yup.string().required('Please select a location.'),
            doctor: Yup.string().required('Please select a doctor.')
        }),

        onSubmit: async (values, {resetForm}) => {
            // TODO - check if the values.doctor passes username or email and handle in backend appropriately
            stompClient.current.publish({
                destination: "/app/currentVisit/new",
                body: JSON.stringify(
                    new StompMessage(
                        "NewVisitRequest",          // messageType
                        user?.user?.username,       // senderUsername
                        values.doctor,              // recipientUsername
                        VisitDTO.build(             // payload
                            values.doctor,              // doctorUsername
                            user?.user?.username,       // patientUsername
                            values.location,            // locationName
                        )
                    )
                )
            })
            
            resetForm();
            setSuccessMessage("Visit Request Sent!")
            setLoading(true)
            setTimeout(() => {
                setLoading(false)
                navigate("/patient/visits")
                
            }, 1000)
            
        }
    })

    async function fetchDocsAtLocation(){
        setLoadingDocs(true);
        setErrorMessage(null);
        setWarningMessage(null);

        try {
            const response = await axios.get(
                "/api/locations/activeDoctors?location_name="+formik.values.location,
                { headers }
            )
        
            setDocsAtLocation(response?.data);
            setLoadingDocs(false);

            if(response?.data[0] === undefined){
                setWarningMessage("No doctors currently checked in at the specified location. Choose another location or try again later.")
            }

        } catch(error){
            setLoadingDocs(false);
            console.log(error);

            if(error?.response?.status === 401){
                setErrorMessage("Something went wrong, re-authenticate and try again.")
            } else {
                setErrorMessage(error?.response?.data);
            }
        }
    }

    useEffect(() => {
        if(formik.values.location !== ""){
            fetchDocsAtLocation();
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

export default NewVisitForm;