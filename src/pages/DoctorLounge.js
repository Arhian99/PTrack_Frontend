import React, {useEffect} from 'react'
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';



export default function DoctorLounge() {
    const {user} = useAuth();
    const navigate = useNavigate();
    function goBack() {
        return navigate(-1);
    }
    useEffect(() => {
        if(user?.user.roles[0].name !== "ROLE_DOCTOR") {
          navigate("/unauthorized")
        }
    }, [])

  return (
    <div>
        <h1>Welcome to the Doctor's Lounge</h1>
        <h3>Your Credentials:</h3>
        <ul>
            <li>Username: {user?._user?.username}</li>
            <li>Email: {user?._user?.email}</li>
            <li>Role: 
                <ul>
                    {user?._user?.roles.map(role => <li>{role.name}</li>)}
                </ul>
            </li>
        </ul>
        <Button onClick={goBack}>Go Back</Button>
    </div>
  )
}
