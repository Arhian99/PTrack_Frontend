import React, { useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import * as Yup from 'yup';
import useAuth from '../hooks/useAuth';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Alert, FormControl } from 'react-bootstrap';
import { handleLogin } from '../api/dataFetching';

/*
Login Form Component
Handles frontend form validation using Yup validation Schema and Formik for styling and validation styling logic.
Handles sending request to backend auth API depending on the role chosen.
Handles backend responses by either displaying error messages or redirecting user to Home Page or Unauthorized Page
Uses Axios to send POST request to backend auth API
Takes errorMessage prop from Authenticate page which is the state variable that stores whether or not the backend returned an error code. (this state variable is shared with RegisterForm component so it was raised)
*/
export default function LoginForm({errorMessage, setErrorMessage, setLoading}) {
    const {setUser} = useAuth(); // imports setUser function from global auth context using custom useAuth() hook

    // navigation
    const navigate = useNavigate(); // custom built in hook by react-router returns navigation object which can be used to navigate programmatically.

    // form controls, frontend form validation, and form styling using Formik and Yup 
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


        // formik passes form values as 'values' object 
        onSubmit: async (values) => {handleLogin(values, setLoading, setErrorMessage, setUser, navigate)}
    })

    return(
        // form component takes formik.handleSubmit function as onSubmit function
        // the onChange, onBlur, and values props in the form components are mapped to the formik's object function and properties respectively
        // therefore handing control of the form to formik library
        <Form style={{width: "350px"}} onSubmit={formik.handleSubmit} >
            {/* Renders Alert component with error message if any */}
            {/* Checks if there are any error messages returned from the backend, if so it displays them*/ }
            { errorMessage!==null ? <Alert variant='danger' > {errorMessage} </Alert> : null }

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