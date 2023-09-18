import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";


/*
Authenticate Page displays the LoginForm component or the RegisterForm component depending on the activeForm state variable, which
is set by the Login or SignUp toggle buttons.
Redirects users that are logged in to the Home page
Passes loading and errorMessage state variables and functions down to the LoginForm and RegisterForm components
*/
function Authenticate() {
    const {user} = useAuth(); // // imports user state variable from global auth context using custom useAuth() hook
    const [loading, setLoading] = useState(false); // set true when page is waiting for backend response
    const [activeForm, setActiveForm] = useState('login'); // decides which component (LoginForm or RegisterForm) will be rendered based on the value of this state variable
    const [errorMessage, setErrorMessage] = useState(null); // errorMessages returned from the backend are stored in this state variable and rendered in the LoginForm and RegisterForm components
    const navigate = useNavigate(); // custom built in hook by react-router returns navigation object which can be used to navigate programatically.

    // the purpose of this is to check for any logged in users that come to this page and redirect them to the home page.
    useEffect(() =>{
        console.log(user)
        if(user!==null){
            navigate("/")
        }
    })

    return (
        // if loading displays the loading component, otherwise it displays the forms
        loading ? <Loading /> :
            <Container className="d-flex flex-column justify-content-center align-items-center" >
                <ToggleButtonGroup className="mb-3" style={{width: "350px"}} type="radio" value={activeForm} name="roles">
                    <ToggleButton variant='primary' 
                        value={'login'} 
                        onClick={() => {
                            setActiveForm('login');
                            setErrorMessage(null)
                        }}> Login 
                    </ToggleButton>

                    <ToggleButton variant='primary'
                        value={'signup'} 
                        onClick={() => {
                            setActiveForm('signup');
                            setErrorMessage(null)}}> Sign Up 
                    </ToggleButton>
                </ToggleButtonGroup>
                {/* renders loginForm or registerForm based on the value of activeForm variable*/}
                {activeForm === 'login' ? <LoginForm errorMessage={{errorMessage, setErrorMessage}} setLoading={setLoading}/> : <RegisterForm errorMessage={{errorMessage, setErrorMessage}} loading={setLoading}/>}
            </Container>
    );

}

export default Authenticate;