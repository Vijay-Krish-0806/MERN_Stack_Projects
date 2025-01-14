import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
// import './bootstrap.min.css'
import { Provider } from 'react-redux'
import store from './store'
import { GoogleOAuthProvider } from '@react-oauth/google'
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <GoogleOAuthProvider clientId='13651812709-lo9jq1ue2udhm070lsvvpdja9qqnf8q3.apps.googleusercontent.com'>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </GoogleOAuthProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
