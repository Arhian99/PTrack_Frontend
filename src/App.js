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
import Draft from './pages/Draft';


function App() {
  return (
    <Routes>
      {/* public routes */}
      <Route path='/authenticate' element={<Authenticate />} />
      <Route path='/unauthorized' element={<Unauthorized />} />
      <Route path='/unconfirmed'  element={<Unconfirmed />} />

      {/* protected routes */}
      {/* Check the role of the user at Home.js page and render a Home page according to the role (either a doctor or a patient home page) */}
      <Route element={<ProtectedRoutes />} >
        <Route path='/' element={<Draft />} />
        <Route path="patient" element={<PatientLounge />} />
        <Route path="doctor" element={<DoctorLounge />} />
      </Route>

    </Routes>
  )
}

export default App;



/*
TODO:
  - Set Auth user on local storage and persist session across refreshes
  - Fix the fact that we cant navigate typing URL into address bar.
  - Make Doctor Home and Patient Home components and render on Home page according to signed in user.
  - Build out Patient and Doctor Lounge as "Profile pages"
  - Make/ Configure 404 error page

*/