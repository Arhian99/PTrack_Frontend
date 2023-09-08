import React from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'

export default function Unauthorized() {
    const navigate = useNavigate();
    function goBack(){
        return navigate(-1)
    }
  return (
    <>
        <h1>Unauthorized :(</h1>
        <Button onClick={goBack}>Go Back</Button>
    </>

  )
}
