import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Button } from "react-bootstrap";
import { useEffect } from "react";


export default function PatientLounge() {
  const {user} = useAuth();
  const navigate = useNavigate();

  function goBack(){
    return navigate(-1);
  }

  useEffect(() => {
    if(user?.user.roles[0].name !== "ROLE_USER") {
      navigate("/unauthorized")
    }
  }, [])

  return (
    <div>
      <h1>Welcome to the Patient's Lounge</h1>
      <h3>Your Credentials:</h3>
      <ul>
        <li>Username: {user?.user?.username}</li>
        <li>Email: {user?.user?.email}</li>
        <li>Role: {user?.user.roles[0].name}</li>
      </ul>
      <Button onClick={goBack}>Go Back</Button>
    </div>
  )
}
