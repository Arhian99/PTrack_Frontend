import React from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

// This component navigates to the previous page in the browser history
function BackButton({isUnauthorized}) {
    const navigate = useNavigate();

    function goBack() {
      return isUnauthorized ? navigate("/") : navigate(-1);
    }

  return (
    <Button onClick={goBack} className='d-block my-3'>Go Back</Button>
  )
}

export default BackButton