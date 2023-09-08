import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import * as Yup from 'yup';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import { useFormik } from 'formik';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FormControl } from 'react-bootstrap';
import {formatBackendRegistrationURL} from '../utils/utilities'
import Loading from '../pages/Loading';

export default function RegisterForm() {
    const {user, setUser} = useAuth();
    const [loading, setLoading] = useState(false);

    //navigation
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    // handles forms
    const formik = useFormik({
        initialValues: {
            email:'',
            username:'',
            password:'',
            password2:'',
            roles:''
        },
        // frontend validation schema
        validationSchema: Yup.object({
            email: Yup.string().email('Please enter a valid email address.').required('Email address is required.'),
            username: Yup.string().min(6, 'Username must be 6 characters or more.').max(15, 'Username must be 15 characters or less.')
                                  .matches(/^[a-zA-Z0-9._-]{6,30}$/,'Only alphanumeric characters, periods (.), hyphens (-), and underscores (_) allowed.')
                                  .required('Username is required.'),
            password: Yup.string().min(6, 'Password must be 6 characters or more.').max(30, 'Password must be 30 characters or less.')
                                  .matches(/^(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{6,30}$/, 'Password must include at least one uppercase letter.')
                                  .matches(/^(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{6,30}$/, 'Password must include at least one lowercase letter.')
                                  .matches(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,30}$/, 'Password must include at least one number.')
                                  .matches(/^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,30}$/, 'Password must include at least one special character (! @ # $ % ^ & * ).')
                                  .required('Password is required.'),
            password2: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match.').required('Please enter repeat password.'),
            roles: Yup.string().oneOf(["ROLE_USER", "ROLE_DOCTOR"], "Please select a valid role.").required("Please select a role.")
        }),
        // formik passes form values as 'values' object
        onSubmit: async (values) => {
            setLoading(true)
            // formats backend auth api url based on role chosen by user /auth/save/user or /auth/save/doctor
            let url = formatBackendRegistrationURL(values.roles);
            try {
                // post request to backend auth api
                const response = await axios.post(
                    url, // ie:  auth/save/user
                    values,  // form values
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            withCredentials: true
                        }
                    }
                );
                
                setLoading(false)
                if(response.status === 201){
                    if(response.data !== undefined) {
                        setUser(response.data); // setting global auth user
                        
                    } else if (response.data !== undefined){
                        setUser(response.data); // setting global auth user
                    }
                    console.log("Registration success!")
                    // navigation
                    navigate("/unconfirmed");

                } else if(response.status >= 400) {
                    // TODO: HANDLE CASES
                    // case 1: returns 400 with message 'Email is already in use'
                    // case 2: returns 400 with message 'Username is already taken'

                    console.log("Registration failed!")
                    
                    // navigation
                    navigate("/");
                }
                
            } catch(error) {
                // TODO: HANDLE ALL ERRORS
                console.log(error.response.data)
                console.log(error.message)
            }
        }
    })

    return(
        // react form code, handles form control to formik
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

               
                <Form.Group className="mb-2" controlId="username">
                    <Form.Label>Username: </Form.Label>
                    <Form.Control 
                        type="username"
                        name="username"
                        placeholder="Juan_Johnson"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />
                    <Form.Text className='text-danger'>
                        {formik.touched.username && formik.errors.username ? (
                            <div className='text-danger'>{formik.errors.username}</div>
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

                
                <Form.Group className="mb-2" controlId="password2">
                    <Form.Label>Confirm Password: </Form.Label>
                    <Form.Control 
                        type="password"
                        name="password2"
                        placeholder="Confirm Password" 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password2}
                        autoComplete="off"
                    />
                    <Form.Text className='text-danger'>
                        {formik.touched.password2 && formik.errors.password2 ? (
                            <div className='text-danger'>{formik.errors.password2}</div>
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
        );
}

