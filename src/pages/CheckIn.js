import React, {useState, useMemo, useEffect} from 'react'
import BackButton from '../components/BackButton'
import { Alert, Container } from 'react-bootstrap'
import useAuth from '../hooks/useAuth';
import DoctorCheckInForm from '../components/DoctorCheckInForm';
import CheckedIn from '../components/CheckedIn';
import useLoading from '../hooks/useLoading';
import Loading from './Loading';

function CheckIn() {
    const {user} = useAuth();
    const [errorMessage, setErrorMessage] = useState(null);
    const [warningMessage, setWarningMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const {loading, setLoading} = useLoading();

    return (
        loading ? <Loading /> :
        <Container className="mt-3">
            <>
            { user?.doctor?.isCheckedIn ?
                    <Container>
                        {errorMessage!== null ? <Alert variant='danger'>{errorMessage}</Alert> : null}
                        {warningMessage !== null ? <Alert variant='warning'>{warningMessage}</Alert> : null }
                        {successMessage!== null ? <Alert variant='success'>{successMessage}</Alert> : null }

                        <CheckedIn
                            setLoading={setLoading}
                            setErrorMessage={setErrorMessage}
                            setWarningMessage={setWarningMessage}
                            setSuccessMessage={setSuccessMessage}
                        />
                    </Container>
                : 
                    <Container>
                        <h1>Check In</h1>
                        {errorMessage!== null ? <Alert variant='danger'>{errorMessage}</Alert> : null}
                        {warningMessage !== null ? <Alert variant='warning'>{warningMessage}</Alert> : null }
                        {successMessage!== null ? <Alert variant='success'>{successMessage}</Alert> : null }
                        <DoctorCheckInForm
                            setLoading={setLoading}
                            setErrorMessage={setErrorMessage}
                            setWarningMessage={setWarningMessage}
                            setSuccessMessage={setSuccessMessage}
                        />
                        <BackButton />
                    </Container>
            }
            </>
        </Container>
    )
}

export default CheckIn;