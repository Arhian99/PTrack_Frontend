import React, { useState } from 'react'
import BackButton from '../components/BackButton'
import { Button, Container, Form, FormControl } from 'react-bootstrap'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Loading from '../pages/Loading'

//TODO: load location options from backend API /api/locations/all and render them in select dropdown 
//TODO: load doctor options from the activeDoctors set field of the selected location object and render the options in the select dropdown
// TODO: handle backend responses upon form submission
// TODO: Handle backend errors 
function CheckIn() {
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

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
            setLoading(true)
            setErrorMessage(null)
            
            try {

            } catch(error) {
                setLoading(false)
                console.log(error)
            }
        }
    })
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
                            <option value="0">Zero</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                            <option value="4">Four</option>
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
                            <option value="0">Zero</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                            <option value="4">Four</option>
                    </Form.Select>
                    <Form.Text className='text-danger'>
                        {formik.touched.doctor && formik.errors.doctor ? (
                            <div className='text-danger'>{formik.errors.doctor}</div>
                        ) : null}
                    </Form.Text>
                </Form.Group>
            
                <Button type='submit' className='d-block my-3'>Submit</Button>
            </Form>
            <BackButton />  
        </Container>
    )
}

export default CheckIn