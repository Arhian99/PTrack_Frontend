import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Button } from "react-bootstrap";


export default function PatientLounge() {
  const {user} = useAuth();
  const navigate = useNavigate();

  function goBack(){
    return navigate(-1);
  }

  return (
    <div>
      <h1>Welcome to the Patient's Lounge</h1>
      <h3>Your Credentials:</h3>
      <ul>
        <li>Username: {user?.user?.username}</li>
        <li>Email: {user?.user?.email}</li>
        <li>Role: 
          <ul>
            {user?.user?.roles.map(role => <li>{role.name}</li>)}
          </ul>
        </li>
      </ul>
      <Button onClick={goBack}>Go Back</Button>
    </div>
  )
}
