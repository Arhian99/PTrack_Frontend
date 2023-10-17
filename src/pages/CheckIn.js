import React, {useState, useMemo, useEffect} from 'react'
import BackButton from '../components/BackButton'
import { Alert, Container } from 'react-bootstrap'
import Loading from '../pages/Loading'
import useAuth from '../hooks/useAuth';

import DoctorCheckIn from '../components/DoctorCheckIn';
import CheckedIn from '../components/CheckedIn';
import useLoading from '../hooks/useLoading';

function CheckIn() {
    const {user} = useAuth();
    const [errorMessage, setErrorMessage] = useState(null);
    // eslint-disable-next-line
    const[warningMessage, setWarningMessage] = useState(null);
    const[successMessage, setSuccessMessage] = useState(null);
    const[isCheckedIn, setIsCheckedIn] = useState(user?.doctor.isCheckedIn);
    const{loading, setLoading} = useLoading();

    const headers = useMemo(() => ({
        Authorization: 'Bearer '.concat(user?.jwt),
        'Content-Type': 'application/json',
        withCredentials: true
    }), [user?.jwt])


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
                            headers={headers}
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
                        <DoctorCheckIn
                            setLoading={setLoading}
                            headers={headers}
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

// return (
//         isCheckedIn ?
//             <Container className='mt-3'>
//                 {errorMessage!== null ? <Alert variant='danger'>{`${errorMessage}`}</Alert> : null}
//                 {warningMessage !== null ? <Alert variant='warning'>{warningMessage}</Alert> : null }
//                 {successMessage!== null ? <Alert variant='success'>{successMessage}</Alert> : null }

//                 <CheckedIn 
//                     setSuccessMessage={setSuccessMessage}
//                     // loading={loading}
//                     // setLoading={setLoading}
//                     setErrorMessage={setErrorMessage}
//                     headers={headers}
//                     setIsCheckedIn={setIsCheckedIn}
//                 />
//             </Container>
//             : 
//             <Container className='mt-3'>
//                 <h1>Check In</h1>
//                 {errorMessage!== null ? <Alert variant='danger'>{`${errorMessage}`}</Alert> : null}
//                 {warningMessage !== null ? <Alert variant='warning'>{warningMessage}</Alert> : null }
//                 {successMessage!== null ? <Alert variant='success'>{successMessage}</Alert> : null }
//                 <DoctorCheckIn
//                     headers={headers}
//                     // loading={loading}
//                     // setLoading={setLoading}
//                     setErrorMessage={setErrorMessage}
//                     setSuccessMessage={setSuccessMessage}
//                     setIsCheckedIn={setIsCheckedIn}
//                 />
//                 <BackButton />  
//             </Container>
//     )