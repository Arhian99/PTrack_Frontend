import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
//bootstrap minimum required css
import 'bootstrap/dist/css/bootstrap.min.css';
// bootstrap sass modifications
import './App.scss';
import { AuthProvider } from './context/AuthProvider';
import {BrowserRouter} from 'react-router-dom'
import { LoadingProvider } from './context/LoadingProvider';

// react app entry point
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>

    <BrowserRouter>
      <AuthProvider>
        <LoadingProvider>
          <App />
        </LoadingProvider>
      </AuthProvider>
    </BrowserRouter>

  </React.StrictMode>
);

