import React, {useEffect} from 'react'
import useAuth from '../hooks/useAuth'
import {useNavigate, Outlet} from 'react-router-dom'

export default function ProtectedRoutes() {
    const {user} = useAuth();
    const navigate = useNavigate();

    console.log(user)

    useEffect(() => {
      if(user===null){
        navigate("/authenticate")
      } else if(!user.user.isEnabled){
        navigate("/unconfirmed")
      } 
    }, [user])


  return (
    <Outlet />
  )
}
