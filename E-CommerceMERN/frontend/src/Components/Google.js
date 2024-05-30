import React from 'react'
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export const Google = () => {
  return (
    <div>
      <GoogleLogin
            onSuccess={credentialResponse => {
              console.log(credentialResponse.credential);
              axios({
        method: "POST",
        url: `${process.env.REACT_APP_API}/google-login`,
        data: { code: credentialResponse.credential}, // Send the authorization code
      })
        .then(response => {
          console.log("Google signin success", response);
        })
        .catch(error => {
          console.log("Google signin error", error.response);
        });
            }}
          
            onError={() => {
              console.log('Login Failed');
            }}
          
          />
    </div>
  )
}
