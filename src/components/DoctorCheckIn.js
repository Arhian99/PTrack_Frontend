import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, Form } from 'react-bootstrap'
import axios from '../api/axios';
import { getRole } from '../utils/utilities';

function DoctorCheckIn({user, setLoading, headers, locations, setErrorMessage, setSuccessMessage }) {
    const formik = useFormik({
        initialValues: {
            location:''
        },

        validationSchema: Yup.object({
            location: Yup.string().required('Please select a location.')
        }),

        onSubmit: async (values) => {
            try {
                setLoading(true);
                setErrorMessage(null);
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
                    console.log("Successful Check In!")
                    console.log(response);
                    user.doctor.isCheckedIn = true;
                    setSuccessMessage("Check In Successful!");
                }
                
            } catch(error) {
                setLoading(false)
                console.log(error)

                if(error.response.status === 401){
                    setErrorMessage("Something went wrong, re-authenticate and try again.")
                } else{
                    setErrorMessage(error.response.data)
                }
            }
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
                            {locations.map((location) => <option value={location.name} key={location.name}>{location.name}</option>)}
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
}

export default DoctorCheckIn