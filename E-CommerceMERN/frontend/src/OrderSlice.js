// orderlice.js
import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { getCookie } from './Components/Helpers'

const initialState = {
  loading: false,
  order: {},
  error: null,
}

const orderSlice = createSlice({
  name: 'orderSlice',
  initialState,
  reducers: {
    setOrder: (state, action) => {
      state.loading = false
      state.order = action.payload
      state.error = null
    },
    setLoading: (state) => {
      state.loading = true
      state.order = {}
      state.error = null
    },
    setError: (state, action) => {
      state.loading = false
      state.order = {}
      state.error = action.payload
    },
  },
})

export const { setOrder, setLoading, setError } = orderSlice.actions

export const orderList = (order) => async (dispatch) => {
  try {
    dispatch(setLoading())
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('token')}`,
      },
    }
    await axios
      .post('/api/orders', { order }, config)
      .then((response) => {
        // console.log('order successful', response.data)
        dispatch(setOrder(response.data))
      })
      .catch((err) => {
        console.log('error in placing order', err)
      })
  } catch (error) {
    dispatch(setError(error.message || 'Error fetching order list'))
  }
}

export default orderSlice.reducer
