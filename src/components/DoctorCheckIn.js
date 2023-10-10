import React, {useState, useCallback, useEffect} from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, Form } from 'react-bootstrap'
import axios from '../api/axios';
import { getRole } from '../utils/utilities';
import useAuth from '../hooks/useAuth';

function DoctorCheckIn({setLoading, headers, setErrorMessage, setSuccessMessage, setIsCheckedIn }) {
    const{user, setUser} = useAuth();
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setSuccessMessage(null);
            // setWarningMessage(null);
            setErrorMessage(null);
        }, 8500)
    }, [])


    useEffect( () => {
        async function fetchLocations(){
            setErrorMessage(null)
            try{
                // setLoading(true)
                const response = await axios.get(
                    "/api/locations/all",
                    { headers },
                )
                console.log(response)
                setLocations(response.data);
                // setLoading(false)
    
            } catch(error) {
                // setLoading(false)
                // 401 --> unauthorized
                if(error.response.status === 401){
                    setErrorMessage("Something went wrong, re-authenticate and try again.")
                } else {
                    setErrorMessage(error.response.data);
                }
            }
        }
        setLoading(true);
        fetchLocations();
        setLoading(false);

    }, [])
    
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
                        "email": user?.doctor.email,
                        "jwt": user?.jwt,
                        "role": getRole(user)
                    },
                    { headers }
                )
                
                setLoading(false)

                if(response.status === 200){
                    console.log("Successful Check In!")
                    setUser(response.data);
                    setIsCheckedIn(true);
                    setSuccessMessage("Check In Successful!");
                }
                
            } catch(error) {
                setLoading(false)

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