import React from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <>
        <h1> Unauthorized :( </h1>
        <Button onClick={navigate(-1)}>Go Back</Button>
    </>

  )
}
