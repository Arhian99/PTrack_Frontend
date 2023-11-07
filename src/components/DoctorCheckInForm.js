import React, {useState, useEffect} from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, Form, Spinner, Alert } from 'react-bootstrap'
import useAuth from '../hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { handleCheckIn, updateLocations } from '../api/dataFetching';

function DoctorCheckInForm({setLoading, setErrorMessage, setWarningMessage, setSuccessMessage}) {
    const{user, setUser} = useAuth();
    const queryClient = useQueryClient();
    const [locationsDataState, setLocationsDataState] = useState(queryClient.getQueryState(['allLocations']));
    
    useEffect(() => {
        updateLocations(locationsDataState, setLocationsDataState, queryClient, user)

        /*FIXME - sometimes the code inside setTimeout() is called too soon, sometimes it takes too long, 
        setTimeout() not taking the same time each call */
        setTimeout(() => {
            setSuccessMessage(null);
            setWarningMessage(null);
            setErrorMessage(null);
        }, 8500)
    }, [])
    
    const formik = useFormik({
        initialValues: {
            location:''
        },

        validationSchema: Yup.object({
            location: Yup.string().required('Please select a location.')
        }),

        onSubmit: async (values) => handleCheckIn(values, setLoading, setErrorMessage, setSuccessMessage, user, setUser)
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
                    {
                        locationsDataState?.status==="loading" ? <Spinner animation="border" variant="success" /> :
                        locationsDataState?.status==="error" ? <Alert variant='danger'>{locationsDataState?.error}</Alert> :
                        locationsDataState?.data?.data.map((location) => <option value={location.name} key={location.name}>{location.name}</option>)
                    }
                </Form.Select>
                <Form.Text className='text-danger'>
                    {formik.touched.location && formik.errors.location ? (
                        <div className='text-danger'>{formik.errors.location}</div>
                    ) : null}
                </Form.Text>
            </Form.Group>
            
            <Button type="submit" className='d-block my-3'>Submit</Button>
        </Form>
    )
};

export default DoctorCheckInForm;