import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { Form, Button, Spinner } from 'react-bootstrap';
import useAuth from '../hooks/useAuth';
import useLoading from '../hooks/useLoading';
import { useNavigate } from 'react-router-dom';
import VisitDTO from '../DTOs/VisitDTO';
import StompMessage from '../DTOs/StompMessage';
import useStomp from '../hooks/useStomp';
import { useQueryClient } from '@tanstack/react-query';
import { fetchDocsAtLocation, newVisitRequestStomp, updateLocations } from '../api/dataFetching';


function NewVisitForm({setErrorMessage, setWarningMessage, setSuccessMessage }) {
    const{user} = useAuth();
    const{setLoading} = useLoading();
    const[docsAtLocation, setDocsAtLocation] = useState();
    const[loadingDocs, setLoadingDocs] = useState(false);
    const navigate = useNavigate();
    const stompClient = useStomp();
    const queryClient = useQueryClient();
    const [locationsDataState, setLocationsDataState] = useState(queryClient.getQueryState(['allLocations']))
    
    useEffect(() => {
        locationsDataState?.status==="loading" ? setLoading(true) : setLoading(false)
        updateLocations(locationsDataState, setLocationsDataState, queryClient)
    }, [locationsDataState]);

    useEffect(() => {
        if(formik.values.location !== ""){
            fetchDocsAtLocation(user, formik.values.location, setDocsAtLocation, setLoadingDocs, setErrorMessage, setWarningMessage);
        }
    }, [formik.values.location])

    const formik = useFormik({
        initialValues: {
            location:'',
            doctor:''
        },

        validationSchema: Yup.object({
            location: Yup.string().required('Please select a location.'),
            doctor: Yup.string().required('Please select a doctor.')
        }),

        onSubmit: (values, {resetForm}) => {
            newVisitRequestStomp(values, {resetForm}, stompClient, queryClient, user, setSuccessMessage, setLoading, navigate)
        }
    })

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
                            {locationsDataState?.data?.data.map((location) => <option value={location.name} key={location.name}>{location.name}</option>)}
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