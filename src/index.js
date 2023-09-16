import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
//bootstrap minimum required css
import 'bootstrap/dist/css/bootstrap.min.css';
// bootstrap sass modifications
import './App.scss';
import { AuthProvider } from './context/AuthProvider';
import {BrowserRouter, Routes, Route} from 'react-router-dom'

// react app entry point
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <BrowserRouter>
      <AuthProvider>
        {/* <Routes>
          <Route path='/*' element={ <App />} />
        </Routes> */}
        <App />
      </AuthProvider>
    </BrowserRouter>

  </React.StrictMode>
);

