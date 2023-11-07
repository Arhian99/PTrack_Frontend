import { Container, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo512.png"
import useLoading from "../hooks/useLoading";
import { toggleAuthenticateForm } from "../utils/utilities";
import useAuth from "../hooks/useAuth";
import useStomp from "../hooks/useStomp";

/*
Authenticate Page displays the LoginForm component or the RegisterForm component depending on the activeForm state variable, which
is set by the Login or SignUp toggle buttons.
Redirects users that are logged in to the Home page
Passes loading and errorMessage state variables and functions down to the LoginForm and RegisterForm components
*/
function Authenticate() {
    const {user} = useAuth();
    const {loading, setLoading} = useLoading(); // set true when page is waiting for backend response
    const [activeForm, setActiveForm] = useState('login'); // decides which component (LoginForm or RegisterForm) will be rendered based on the value of this state variable
    const [errorMessage, setErrorMessage] = useState(null); // errorMessages returned from the backend are stored in this state variable and rendered in the LoginForm and RegisterForm components
    const navigate = useNavigate(); // custom built in hook by react-router returns navigation object which can be used to navigate programatically.
    const stompClient = useStomp();

    useEffect(() =>{
        if(user!==null){
            navigate("/");
            stompClient?.current?.activate();
        }

        stompClient?.current?.deactivate();
    }, [user]);

    return (
        // if loading displays the loading component, otherwise it displays the forms
        loading ? <Loading /> :
        <Container fluid className="d-flex flex-column align-items-center py-5">
            <Image fluid src={logo} className="rounded-circle p-2 m-3" style={{maxWidth: "150px"}}/>      
            <Container className="d-flex flex-column justify-content-center align-items-center" >
                <ToggleButtonGroup className="mb-3" style={{width: "350px"}} type="radio" value={activeForm} name="roles">
                    <ToggleButton variant='primary' 
                        value={'login'} 
                        onClick={(e) => toggleAuthenticateForm(e.currentTarget.value, setActiveForm, setErrorMessage)}> Login 
                    </ToggleButton>

                    <ToggleButton variant='primary'
                        value={'signup'} 
                        onClick={(e) => toggleAuthenticateForm(e.currentTarget.value, setActiveForm, setErrorMessage)}> Sign Up 
                    </ToggleButton>
                </ToggleButtonGroup>
                {/* renders loginForm or registerForm based on the value of activeForm variable*/}
                {
                    activeForm === 'login' ? 
                        <LoginForm errorMessage={errorMessage} setErrorMessage={setErrorMessage} setLoading={setLoading} /> 
                                            : 
                        <RegisterForm errorMessage={errorMessage} setErrorMessage={setErrorMessage} setLoading={setLoading} /> 
                }
            </Container>
        </Container>
    );

}

export default Authenticate;