import './App.css';
import 'axios';
import Home from './pages/Home'
// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import {Routes, Route} from 'react-router-dom';
import DoctorLounge from './pages/DoctorLounge';
import PatientLounge from './pages/PatientLounge';
import Authenticate from './pages/Authenticate';
import Unauthorized from './pages/Unauthorized';
import Unconfirmed from './pages/Unconfirmed';
import ProtectedRoutes from './components/ProtectedRoutes';
import HomeNav from './components/HomeNav';
import CheckIn from './pages/CheckIn';
import BeginVisit from './components/BeginVisit';
import NewVisit from './pages/NewVisit';

function App() {
  return (
    <Routes>
      {/* public routes */}
      <Route path='/authenticate' element={<Authenticate />} />
      <Route path='/unauthorized' element={<Unauthorized />} />
      <Route path='/unconfirmed'  element={<Unconfirmed />} />

      {/* protected routes */}
      <Route element={<ProtectedRoutes />} >
        <Route element={<HomeNav />} >
          <Route path='/' element={<Home />} />
          <Route path="patient" element={<PatientLounge />} />
          <Route path="doctor" element={<DoctorLounge />} />
          <Route path='/checkIn' element={<CheckIn />} />
          <Route path='/newVisit' element={<NewVisit />} />
        </Route>
      </Route>

    </Routes>
  )
}

export default App;


/*
TODO:
  - Implement "Thanks for Verifying your Email Page." --> when user clicks Verify Email Button on verification email they get redirected to /verifyEmailPage that says "Thanks for Verifying your Email" and has a "Continue to the App" button.  
  - Build out Patient and Doctor Lounge as "Profile pages"
  - Make/configure 404 error page
  - Log user out on the frontend (delete localStorage user object) after certain time of inactivity.
  - Add clean up items upon log out
      -- send request to backend ending Visit, Checking Doctor/Patients Out of Locations, clearing locations activeDoctors and activePatient profiles
*/