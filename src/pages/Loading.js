import React from 'react'
import Layout from '../components/Layout'
import Spinner from 'react-bootstrap/Spinner';
import { Container } from 'react-bootstrap';

function Loading() {
    return(
        <Container >
            <div className="position-absolute top-50 start-50 d-flex">
                <Spinner animation="grow" variant="success" />
                <h1 className='flex-center'>"Loading..."</h1>
                <Spinner animation="grow" variant="success" />
            </div>
            
        </Container>
    )
}

export default Loading