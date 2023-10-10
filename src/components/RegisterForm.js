import React, { useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import * as Yup from 'yup';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Alert, FormControl } from 'react-bootstrap';
import { formatBackendRegistrationURL } from '../utils/utilities';
/*
Register Form Component
Handles frontend form validation using Yup validation Schema and Formik for styling and validation styling logic.
Handles sending request to backend auth API depending on the role chosen.
Handles backend responses by either displaying error messages or redirecting user to Home Page or Unauthorized Page
Uses Axios to send POST request to backend auth API
Takes errorMessage prop from Authenticate page which is the state variable that stores whether or not the backend returned an error code. (this state variable is shared with LoginForm component so it was raised)
*/
export default function RegisterForm({errorMessage, setLoading}) {
    // gets setUser function from global auth user context using the custom useAuth() hook
    const {setUser} = useAuth();

    //navigation. Navigate is a navigation object returned by useNavigate() which is a built in react router custom hook
    const navigate = useNavigate();

    // Formik is used for form styling, frontend input validation and styling
    // Yup is the frontend validation schema
    const formik = useFormik({
        initialValues: {
            email:'',
            username:'',
            password:'',
            password2:'',
            roles:''
        },
        // frontend form validation schema
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
            // loading is set to true when we send the response to the backend and are waiting on it.
            setLoading(true)
            // error messages are reset
            errorMessage.setErrorMessage(null)

            // formats backend auth api url based on role chosen by user /auth/save/user or /auth/save/doctor
            let url = formatBackendRegistrationURL(values.roles);
            // use AXIOS to send POST request to the backend
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
                
                // when code reaches here, the backend response has returned so loading is set to false
                setLoading(false)
                if(response.status === 201){
                    if(response.data !== undefined) {
                        setUser(response.data); // setting global auth user
                    } 
                    //TODO: Debuging purposes, delete
                    console.log("Registration success!")
                    // navigation to /unconfirmed page becasue by default, new users have not confirmed their email.
                    navigate("/unconfirmed");

                }
                
            } catch(error) {
                // if an error is thrown from the backend, we set loading to false sinc backend responded
                setLoading(false)
                // set error message according to the error returned from the backend
                switch(error.response.data){
                    case "Error: Email is already in use! Please login":
                        errorMessage.setErrorMessage("Email is already in use. Please login!")
                        break;
                    case "Error: Username is already in taken!":
                        errorMessage.setErrorMessage("Username is already taken. Please choose another!")
                        break;
                }

                //TODO: Debuging purposes, delete
                console.log(error.response.data)
                console.log(error.message)
            }
        }
    })

    return(
        // react form code, handles form control to formik
        // form component takes formik.handleSubmit function as onSubmit function
        // the onChange, onBlur, and values props in the form components are mapped to the formik's object function and properties respectively
        // therefore handing control of the form to formik library
            <Form style={{width: "350px"}} onSubmit={formik.handleSubmit} >
                {/* Checks if there are any error messages returned from the backend, if so it displays them*/ }
                {errorMessage.errorMessage !== null ? <Alert variant='danger'>{`${errorMessage.errorMessage}`}</Alert> : null}
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

