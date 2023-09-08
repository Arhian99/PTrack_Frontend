import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import * as Yup from 'yup';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import { useFormik } from 'formik';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FormControl } from 'react-bootstrap';
import {formatBackendLoginURL} from '../utils/utilities'
import Loading from '../pages/Loading';


export default function LoginForm() {
    const {user, setUser} = useAuth();
    const [loading, setLoading] = useState(false);

    // navigation
    const navigate = useNavigate(); // provided by react router allows to navigate programmatically
    const location = useLocation(); // provided by react router, returns location object
    const from = location.state?.from?.pathname || "/"; // returns URL of where user was coming from 

    const formik = useFormik({
        initialValues: {
            email:'',
            password:'',
            roles:''
        },
        // frontend form validation schema
        validationSchema: Yup.object({
            email: Yup.string().email('Please enter a valid email address.').required('Email address is required.'),
            password: Yup.string().min(6, 'Password must be 6 characters or more.').max(30, 'Password must be 30 characters or less.')
                                  .matches(/^(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{6,30}$/, 'Password must include at least one uppercase letter.')
                                  .matches(/^(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{6,30}$/, 'Password must include at least one lowercase letter.')
                                  .matches(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,30}$/, 'Password must include at least one number.')
                                  .matches(/^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,30}$/, 'Password must include at least one special character (! @ # $ % ^ & * ).')
                                  .required('Password is required.'),
            roles: Yup.string().oneOf(["ROLE_USER", "ROLE_DOCTOR"], "Please select a valid role.").required("Please select a role.")
        }),


        // formik passes form values as 'values'
        onSubmit: async (values) => {
            setLoading(true)
            // format url according to role. /auth/login/user or /auth/login/doctor
            let url = formatBackendLoginURL(values.roles);
            try {
                const response = await axios.post(
                    url,  // auth api url
                    values, // form values
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            withCredentials: true
                            // TODO: include Authorization header with Bearer token if avaliable
                        }
                    }
                );
                console.log(response)
                setLoading(false)
                // check response 
                if(response.status === 200){
                    console.log(response)
                    if(response.data !== undefined) {
                        setUser(response.data); // setting global auth user
                        
                    } else if (response.data !== undefined){
                        setUser(response.data); // setting global auth user
                    }
                    console.log("Authentication Success!")

                    // navigate to whatever page you were trying to access
                    navigate(from, {replace: true});
                } 
                
                // if(response.status >= 400) {
                //     // TODO: HANDLE CASES. 
                //     // 400: Bad Credentials
                //     // 401: Unauthorized --> isEnabled = false (requires account confirmation in email)

                //     console.log("Authentication Failed!")
                //     // navigation
                //     navigate("/");
                // }
                
            } catch(error) {
                setLoading(false)
                if(error.response.status === 401){
                    navigate("/unconfirmed") // account is not confirmed
                } else if(error.response.status ===400) {
                    //TODO: Display message in UI
                    console.log("Bad Credentials, Try again")
                }
                
                console.log(error.response)
                // TODO: HANDLE ALL ERRORS... Catch Unauthorized errors, wrong email/password and display it in form
            }
        }
    })

// <Alert variant='success' > Registration Success! Please Log In </Alert>


    return(
        loading ? <Loading /> :
        <Form style={{width: "350px"}} onSubmit={formik.handleSubmit} >
            <Form.Group className="mb-2" controlId="email">
                <Form.Label>Email: </Form.Label>
                <Form.Control 
                    type="email"
                    name="email"
                    placeholder="leandroramos@gmail.com" 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                />
                <Form.Text className='text-danger'>
                    {formik.touched.email && formik.errors.email ? (
                        <div className='text-danger'>{formik.errors.email}</div>
                    ) : null}
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-2" controlId="password">
                <Form.Label>Password: </Form.Label>
                <Form.Control 
                    type="password"
                    name="password"
                    placeholder="Password" 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    autoComplete="off"
                />
                <Form.Text className='text-danger'>
                    {formik.touched.password && formik.errors.password ? (
                        <div className='text-danger'>{formik.errors.password}</div>
                    ) : null}
                </Form.Text>
            </Form.Group>


            <Form.Label className='d-block'>Roles: </Form.Label>
            <Form.Group className="mb-2 btn-group">
                <FormControl 
                    type='radio'
                    className='btn-check'
                    name='roles'
                    id='patientRole'
                    onClick={(e) => formik.setFieldValue("roles", e.currentTarget.value, true)}
                    onBlur={formik.handleBlur}
                    value="ROLE_USER"
                />
                <Form.Label 
                    htmlFor='patientRole'
                    className='btn btn-primary'
                >Patient</Form.Label>

                <FormControl 
                    type='radio'
                    className='btn-check'
                    name='roles'
                    id='doctorRole'
                    onClick={(e) => formik.setFieldValue("roles", e.currentTarget.value, true)}
                    onBlur={formik.handleBlur}
                    value="ROLE_DOCTOR"
                />
                <Form.Label 
                    htmlFor='doctorRole'
                    className='btn btn-primary'
                >Doctor</Form.Label>
            </Form.Group>
            <Form.Text className='text-danger'>
                    {formik.touched.roles && formik.errors.roles ? (
                        <div className='text-danger'>{formik.errors.roles}</div>
                    ) : null}
            </Form.Text>
            

            <Button variant="primary" type="submit" className='w-100 d-block my-3'>
                Submit
            </Button> 
        </Form>

        
        

    )


}