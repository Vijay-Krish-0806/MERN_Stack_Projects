import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useParams } from 'react-router-dom'
import { decodeToken } from 'react-jwt'

export const Reset = () => {
  const [values, setValues] = useState({
    name: '',
    token: '',
    newPassword: '',
    buttonText: 'Reset Password',
  })

  const { token } = useParams()
  useEffect(() => {
    console.log(token)
    const { name } = decodeToken(token)
    if (token) {
      setValues({ ...values, name, token })
    }
  }, [token, values])

  const { name, newPassword, buttonText } = values
  const handleChange = (e) => {
    //
    setValues({ ...values, newPassword: e.target.value })
  }
  const clickSubmit = (e) => {
    e.preventDefault()
    setValues({ ...values, buttonText: 'Submitting' })
    axios({
      method: 'PUT',
      url: `${process.env.REACT_APP_API}/reset-password`,
      data: { newPassword, resetPasswordLink: token },
    })
      .then((response) => {
        console.log('Reset password success', response)
        toast.success(response.data.message)
        setValues({ ...values, buttonText: 'Done' })
      })
      .catch((err) => {
        console.log('Reset password error', err.response.data)
        toast.error(err.response.data.error)
        setValues({ ...values, buttonText: 'Reset Password' })
      })
  }
  const paaswordResetForm = () => {
    return (
      <form>
        <div className='row mb-3'>
          <label htmlFor='inputEmail3' className='col-sm-2 col-form-label'>
            Enter new Password
          </label>
          <div className='col-sm-10'>
            <input
              value={newPassword}
              onChange={handleChange}
              type='password'
              placeholder='Type password'
              id='inputEmail3'
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
      <h1>Hey {name}, Reset your Password</h1>
      {paaswordResetForm()}
    </div>
  )
}
