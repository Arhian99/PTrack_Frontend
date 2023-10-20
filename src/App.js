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
import NewVisit from './pages/NewVisit';
import CurrentVisit from './pages/CurrentVisit';
import Visits from './pages/Visits';
import Visit from './pages/Visit';
import DoctorVisits from './pages/DoctorVisits';

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

          <Route path='patient' >
            <Route path="lounge" element={<PatientLounge />} />
            <Route path='visits' >
              <Route index element={<Visits />} />
              <Route path='new' element={<NewVisit />} />
              <Route path='current' element={<CurrentVisit />} />
              <Route path=':id' element={<Visit />} />
            </Route>
          </Route>
          
          <Route path='doctor' >
            <Route path="lounge" element={<DoctorLounge />} />
            <Route path='checkIn' element={<CheckIn />} />
            <Route path='visits'>
              <Route index element={<DoctorVisits />} />
            </Route>
          </Route>
          
        </Route>
      </Route>

    </Routes>
  )
}

export default App;


/* TODO 
  - Implement "Thanks for Verifying your Email Page." --> when user clicks Verify Email Button on verification email they get redirected to /verifyEmailPage that says "Thanks for Verifying your Email" and has a "Continue to the App" button.  
  - Build out Patient and Doctor Lounge as "Profile pages"
  - Make/configure 404 error page
  - Log user out on the frontend (delete localStorage user object) after certain time of inactivity.
      --Consider moving user object to session storage instead of local storage.
  - Move JWT token to HTTP only cookies and set TTL (expiry time) --> Handle JWT more securely. 
  - Add clean up items upon log out
      -- Send request to backend ending Visit, 
      -- Checking Doctor/Patients Out of Locations, 
      -- Clearing locations activeDoctors and activePatient profiles
  - Implement Frontend Caching Policy thorugh Service Workers and CacheStorage APIs
      -- Stale-while-refresh policy --> serve stale data while a request is sent to the backend to retrieve safe data, when the fresh data is recieved, update the UI with the fresh data
      -- 1) Check CacheStorage for data
        2) If CacheStorage has data serve the data check if the data is valid/fresh
        3) If the data is valid, you are done.
        4) if the data is not valid, still serve it but check the HTTP cache for fresh data
        5) if HTTP cache has fresh data, update the UI with the fresh data and update the caccheStorage with the fresh data
        6) otherwise request the data from the server and update the caccheStorage (and the UI) with the fresh data
          ** data requests either to the HTTP cache or to the server happens in the background while the UI already has data (whether fresh or stale)
  - Backend Caching Policy (thorugh CacheControl headers)
      -- Locations -> Shared Cache
      -- Visits -> Private Cache
      -- JWT Token -> HTTP Cookies (with TTL expiration)
      -- User Object -> Local Storage or Session Storage
          ** if in local storage -> set expiry time and delete user object programmatically, prompt frontend re-authentication upon prolonged inactivity.


  - Ensure that Dynamic Routes for Visits works
    - /patient/visits/{id}

  - Elevate location fetching function/ state and provide locations to entire app as opposed to fetching locations at individual components, implement Caching policy
  - Elevate Visits fetching function/state and provide user visits to entire app as opposed to fetching visits at individual components, implement Caching policy, implement Caching policy
      *** Visits MUST be private to signed in user, locations are global
*/