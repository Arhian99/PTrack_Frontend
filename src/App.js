import './App.css';
import 'axios';
import Home from './pages/Home'
// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import {Routes, Route} from 'react-router-dom';
import Layout from './components/Layout';
import DoctorLounge from './pages/DoctorLounge';
import PatientLounge from './pages/PatientLounge';
import Authenticate from './pages/Authenticate';
import Loading from './pages/Loading'
import RequireAuth from './components/RequireAuth';
import Unauthorized from './pages/Unauthorized';
import Unconfirmed from './pages/Unconfirmed';

import UserHome from './pages/UserHome'
import UserNavbar from './components/UserNavbar';
import { useEffect, useState } from 'react';

function App() {
  const[loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <Routes>
      <Route path='/' element={<Layout/>} >
        {/* Public Routes */}
        <Route path='authenticate' element={<Authenticate />}/>
        <Route path='unauthorized' element={<Unauthorized />} />
        <Route path='unconfirmed'  element={<Unconfirmed />} />
        {/* TODO: Make error page route to catch all unhandled routes
          <Route path='*' element ={<ErrorPage />} />
        */}

        {/* Protected Route: Only authenticated users allowed, before account confirmation is complete*/}

        { /*RequireAuth component checks the role of the user and allows access to / or the <Home /> component
          only if the user has one of the specified roles
        */}
        <Route element={<RequireAuth allowedRoles={['ROLE_USER', 'ROLE_DOCTOR', 'ROLE_ADMIN']}/>} >
          <Route path='/' element={ <Home />} />
        </Route>

        {/* Protected Route: only patients allowed*/}
        <Route element={<RequireAuth allowedRoles={['ROLE_USER']}/>} >
          <Route path='patient' element={<PatientLounge />} />
        </Route>

        {/* Protected Route: only doctors allowed*/}
        <Route element={<RequireAuth allowedRoles={['ROLE_DOCTOR']}/>} >
          <Route path='doctor' element={<DoctorLounge />} />
        </Route>

      </Route>
    </Routes>
  )
}

export default App;













/*  <Routes>
      <Route path='/' element={<Layout />}>
          public routes --> comment out
          <Route path='authenticate' element={<Authenticate />} />
          <Route path='unauthorized' element={<Unauthorized />} />

          any authenticated user or doctor --> comment out
          <Route element={<RequireAuth allowedRoles={['ROLE_USER', 'ROLE_DOCTOR', 'ROLE_ADMIN']}/>} >
            <Route path='/' element={ <Home />} />
          </Route>

            only authenticated users with USER_ROLE --> comment out
            <Route element={<RequireAuth allowedRoles={['ROLE_USER']}/>} >
              <Route path='patient' element={<PatientLounge />} />
            </Route>
            

            only authenticated users with USER_DOCTOR --> comment out
            <Route element={<RequireAuth allowedRoles={['ROLE_DOCTOR']}/>} >
              <Route path='doctor' element={<DoctorLounge />} />
            </Route>
      </Route>
    </Routes> */