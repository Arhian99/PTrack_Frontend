import React, { useEffect, useState } from 'react'
import Spinner from 'react-bootstrap/Spinner';
import { Container } from 'react-bootstrap';

function Loading() {
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [show4, setShow4] = useState(false);
    const [show5, setShow5] = useState(false);

    useEffect(() => {
        const timeout1 = setTimeout(() => {
            setShow1(true);
        }, 500);

        const timeout2 = setTimeout(() => {
            setShow2(true);
        }, 1000);

        const timeout3 = setTimeout(() => {
            setShow3(true);
        }, 1500);

        const timeout4 = setTimeout(() => {
            setShow4(true);
        }, 2000);

        const timeout5 = setTimeout(() => {
            setShow5(true);
        }, 2500);

        return () => {
            clearTimeout(timeout1)
            clearTimeout(timeout2)
            clearTimeout(timeout3)
            clearTimeout(timeout4)
            clearTimeout(timeout5)
        }
    }, [])

    return(
        <Container fluid className='bg-black p-0 vh-100 d-flex align-items-center justify-content-center'>
            <div className="d-flex flex-column">
                <h1 className='flex-center'>Loading...</h1>
                <div>
                    <Spinner animation="grow" variant="success" />
                    {show1 && <Spinner animation="grow" variant="success" />}
                    {show2 && <Spinner animation="grow" variant="success" />}
                    {show3 && <Spinner animation="grow" variant="success" />}
                    {show4 && <Spinner animation="grow" variant="success" />}
                    {show5 && <Spinner animation="grow" variant="success" />}
                </div>
            </div>
        </Container>
    )
}

export default Loading