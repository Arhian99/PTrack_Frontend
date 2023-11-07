import React, { useEffect, useState, useMemo, useCallback } from 'react'
import BackButton from '../components/BackButton'
import { Alert, Container } from 'react-bootstrap'
import Loading from '../pages/Loading'
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import NewVisitForm from '../components/NewVisitForm';
import useLoading from '../hooks/useLoading';

function NewVisit() {
    const {loading} = useLoading();
    const [errorMessage, setErrorMessage] = useState(null);
    const [warningMessage, setWarningMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setSuccessMessage(null);
            setWarningMessage(null);
            setErrorMessage(null);
        }, 8500)
    }, [successMessage, warningMessage, errorMessage])

    return (
        loading ? <Loading /> : 
        <Container className='mt-3'>
            <h1>New Visit</h1>
            {errorMessage!== null ? <Alert variant='danger'>{errorMessage}</Alert> : null}
            {warningMessage !== null ? <Alert variant='warning'>{warningMessage}</Alert> : null }
            {successMessage!== null ? <Alert variant='success'>{successMessage}</Alert> : null }

            <NewVisitForm
                setErrorMessage={setErrorMessage}
                setWarningMessage={setWarningMessage}
                setSuccessMessage={setSuccessMessage}
            />

            <BackButton />  
        </Container>
    )
}

export default NewVisit