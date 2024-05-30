import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import reportWebVitals from './reportWebVitals';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <GoogleOAuthProvider clientId='13651812709-lo9jq1ue2udhm070lsvvpdja9qqnf8q3.apps.googleusercontent.com'>
    <App />
  </GoogleOAuthProvider>
);

reportWebVitals();
