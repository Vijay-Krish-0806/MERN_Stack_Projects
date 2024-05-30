import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { getCookie } from './Components/Helpers'
const initialState = {
  loading: true,
  orderItems: {},
  error: null,
}

const orderDetailsSlice = createSlice({
  name: 'orderDetailsSlice',
  initialState,
  reducers: {
    setOrderDetail: (state, action) => {
      state.loading = false
      state.orderItems = action.payload
      state.error = null
    },
    setLoading: (state) => {
      state.loading = true
      state.orderItems = {}
      state.error = null
    },
    setError: (state, action) => {
      state.loading = false
      state.orderItems = {}
      state.error = action.payload
    },
  },
})

export const { setOrderDetail, setLoading, setError } =
  orderDetailsSlice.actions

export const orderDetailList = (id) => async (dispatch) => {
  try {
    dispatch(setLoading())
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('token')}`,
      },
    }
    await axios
      .get(`/api/orders/${id}`, config)
      .then((response) => {
        // console.log('order successful', response)
        dispatch(setOrderDetail(response.data))
      })
      .catch((err) => {
        console.log('error in placing order', err)
      })
  } catch (error) {
    dispatch(setError(error.message || 'Error fetching order list'))
  }
}
export default orderDetailsSlice.reducer
