import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { decodeToken } from 'react-jwt'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const Activate = (props) => {
  const [values, setValues] = useState({
    name: '',
    token1: '',
    show: true,
  })
  const { token } = useParams()
  useEffect(() => {
    console.log(`${token}`)
    const { name } = decodeToken(token)
    if (token) {
      setValues({ ...values, name, token })
    }
  }, [token, values])

  const { name } = values
  const clickSubmit = (e) => {
    e.preventDefault()
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/account-activation`,
      data: { token },
    })
      .then((response) => {
        console.log('Account activation success', response)
        setValues({ ...values, show: false })
        toast.success(response.data.message)
      })
      .catch((err) => {
        console.log('account activation error', err.response.data.error)
        toast.error(err.response.data.error)
      })
  }
  const activationLink = () => {
    return (
      <div>
        <h1 className='p-s text-center'>
          Hey {name}, Ready to activate your account?
        </h1>
        <button className='btn btn-outline-primary' onClick={clickSubmit}>
          Activate Account
        </button>
      </div>
    )
  }
  return (
    <div className='col-d-6 offset-md-3'>
      <ToastContainer />
      {activationLink()}
    </div>
  )
}
