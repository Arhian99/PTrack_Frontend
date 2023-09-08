import { Container } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useState } from "react";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';



function Authenticate() {

    const [activeForm, setActiveForm] = useState('login');

    return (
        <Container className="my-4 d-flex flex-column justify-content-center align-items-center" >
            <ToggleButtonGroup className="mb-3" style={{width: "350px"}} type="radio" value={activeForm} name="roles">
                <ToggleButton variant='primary' value={'login'} onClick={() => {setActiveForm('login')}} >Login</ToggleButton>
                <ToggleButton variant='primary' value={'signup'} onClick={() => {setActiveForm('signup')}}>Sign Up</ToggleButton>
            </ToggleButtonGroup>
            
            {activeForm === 'login' ? <LoginForm /> : <RegisterForm />}
        </Container>
        
    );

}

export default Authenticate;