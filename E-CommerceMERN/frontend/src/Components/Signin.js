import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { authenticate, isAuth } from './Helpers'
import { Google } from './Google'

export const Signin = () => {
  const [values, setValues] = useState({
    email: 'callmevk611@gmail.com',
    password: 'ecommerce',
    buttonText: 'Submit',
  })
  const navigate = useNavigate()

  const { email, password, buttonText } = values
  const handleChange = (name) => (e) => {
    //
    setValues({ ...values, [name]: e.target.value })
  }
  const clickSubmit = (e) => {
    e.preventDefault()
    setValues({ ...values, buttonText: 'Submitting' })
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/signin`,
      data: { email, password },
    })
      .then((response) => {
        console.log('Signup success', response)

        //save the response (user,token) localstorage/cookie
        authenticate(response, () => {
          setValues({
            ...values,
            email: '',
            password: '',
            buttonText: 'Submitted',
          })
          toast.success(`Hey ${response.data.user.name},Welcome Back`)
        })
      })
      .catch((err) => {
        console.log('Signin error', err.response.data)
        setValues({ ...values, buttonText: 'Submit' })
        toast.error(err.response.data.error)
      })
  }
  const signinForm = () => {
    return (
      <form className='container'>
        <div className='row mb-3'>
          <label htmlFor='inputEmail3' className='col-sm-2 col-form-label'>
            Email
          </label>
          <div className='col-sm-10'>
            <input
              value={email}
              onChange={handleChange('email')}
              type='email'
              className='form-control'
              id='inputEmail3'
            />
          </div>
        </div>
        <div className='row mb-3'>
          <label htmlFor='inputPassword3' className='col-sm-2 col-form-label'>
            Password
          </label>
          <div className='col-sm-10'>
            <input
              value={password}
              type='password'
              className='form-control'
              id='inputPassword3'
              onChange={handleChange('password')}
            />
          </div>
        </div>
        <div className='container'>
          <button
            onClick={clickSubmit}
            type='submit'
            className='btn btn-primary'
          >
            {buttonText}
          </button>
        </div>
      </form>
    )
  }
  return (
    <div className='col-d-6 offset-md-3 align-items-*-center'>
      <ToastContainer />
      {isAuth() ? navigate('/') : null}
      <h1>Signin</h1>
      {signinForm()}
      <div className='ml-20 m-2'>
        <Google />
      </div>
      <Link
        className='btn btn-sm btn-outline-danger'
        to='/auth/password/forget'
      >
        Forgot Password??
      </Link>
    </div>
  )
}
