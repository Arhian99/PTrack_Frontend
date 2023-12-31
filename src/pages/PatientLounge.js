import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Container } from "react-bootstrap";
import { useEffect } from "react";
import BackButton from "../components/BackButton";
import { getRole } from "../utils/utilities";
/* 
This component contains all the profile information for Patients
*/
export default function PatientLounge() {
  const {user} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(getRole(user) !== "ROLE_USER") {
      navigate("/unauthorized")
    }
  }, [])

  return (
    <Container>
      <h1>Welcome to the Patient's Lounge</h1>
      <h3>Your Credentials:</h3>
      <ul>
        <li>Username: {user?.user?.username}</li>
        <li>Email: {user?.user?.email}</li>
        <li>Role: {user?.user?.roles[0].name}</li>
      </ul>
      <BackButton />
    </Container>
  )
}
