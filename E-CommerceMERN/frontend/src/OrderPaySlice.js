import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { getCookie } from './Components/Helpers'

const initialState = {
  loading: true,
  success: false,
  error: null,
}

const orderPaySlice = createSlice({
  name: 'orderPaySlice',
  initialState,
  reducers: {
    setOrderPay: (state) => {
      state.loading = false
      state.success = true
      state.error = null
    },
    setLoading: (state) => {
      state.loading = true
      state.error = null
    },
    setError: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    setReset: (state) => {
      state.loading = true
      state.success = false
      state.error = null
    }, // Reset to initial state
  },
})

export const { setOrderPay, setLoading, setError, setReset } =
  orderPaySlice.actions

export const orderPayAction = (orderId, paymentResult) => async (dispatch) => {
  try {
    dispatch(setLoading())
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('token')}`,
      },
    }
    await axios
      .put(`/api/orders/${orderId}/pay`, paymentResult, config)
      .then((response) => {
        // console.log('order ay action is completed')
        dispatch(setOrderPay(response.data))
      })
      .catch((err) => {
        console.log('error in placing order', err)
      })
  } catch (error) {
    dispatch(setError(error.message || 'Error fetching order list'))
  }
}

export const reset = () => (dispatch) => {
  dispatch(setReset())
}

export default orderPaySlice.reducer
