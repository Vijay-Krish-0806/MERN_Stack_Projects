import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { isAuth, getCookie, signout } from './Helpers'

export const Private = () => {
  const [values, setValues] = useState({
    name: ' ',
    email: '',
    password: '',
    buttonText: 'Submit',
  })

  const token = getCookie('token')
  const navigator = useNavigate()
  useEffect(() => {
    loadProfile()
  })
  const loadProfile = () => {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log('private update response', response)
        const { name, email } = response.data
        setValues({ ...values, name, email })
      })
      .catch((error) => {
        console.log('profile update error', error.response.data.error)
        if (error.response.status === 401) {
          signout(() => {
            navigator('/')
          })
        }
      })
  }
  const { name, email, password, buttonText } = values
  const handleChange = (val) => (e) => {
    setValues({ ...values, [val]: e.target.value })
  }
  const clickSubmit = (e) => {
    e.preventDefault()
    setValues({ ...values, buttonText: 'Submitting' })
    axios({
      method: 'PUT',
      url: `${process.env.REACT_APP_API}/user/update/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { name, password },
    })
      .then((response) => {
        console.log('Profile update success', response)
        setValues({ ...values, buttonText: 'Submitted' })
        toast.success('Profile updated succesfully')
      })
      .catch((err) => {
        console.log('profile update error', err.response.data.error)
        setValues({ ...values, buttonText: 'Submit' })
        toast.error(err.response.data.error)
      })
  }
  const updateForm = () => {
    return (
      <form>
        <div className='row mb-3'>
          <label htmlFor='inputTextl3' className='col-sm-2 col-form-label'>
            Name
          </label>
          <div className='col-sm-10'>
            <input
              onChange={handleChange('name')}
              value={name}
              type='text'
              className='form-control'
              id='inputTextl3'
            />
          </div>
        </div>
        <div className='row mb-3'>
          <label htmlFor='inputEmail3' className='col-sm-2 col-form-label'>
            Email
          </label>
          <div className='col-sm-10'>
            <input
              defaultValue={email}
              type='email'
              className='form-control'
              id='inputEmail3'
              disabled
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
        <button onClick={clickSubmit} type='submit' className='btn btn-primary'>
          {buttonText}
        </button>
      </form>
    )
  }
  return (
    <div className='col-d-6 offset-md-3'>
      <ToastContainer />
      <h1 className='pt-5'>Private page</h1>
      <p className='text-center lead'>Profile update</p>
      {updateForm()}
    </div>
  )
}
