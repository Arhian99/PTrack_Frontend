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
        </Route>
      </Route>

    </Routes>
  )
}

export default App;



/*
TODO:
  - Build out Patient and Doctor Lounge as "Profile pages"
  - Make/ Configure 404 error page
*/