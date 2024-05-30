// productSlice.js
import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  loading: false,
  product: { reviews: [] },
  error: null,
}

const productDetailSlice = createSlice({
  name: 'productDetailSlice',
  initialState,
  reducers: {
    setProduct: (state, action) => {
      state.loading = false
      state.product = action.payload
      state.error = null
    },
    setLoading: (state) => {
      state.loading = true
      state.product = { ...state }
      state.error = null
    },
    setError: (state, action) => {
      state.loading = false
      state.product = {}
      state.error = action.payload
    },
  },
})

export const { setProduct, setLoading, setError } = productDetailSlice.actions

export const listProduct = (id) => async (dispatch) => {
  try {
    dispatch(setLoading())
    const { data } = await axios.get(`/api/products/${id}`)
    dispatch(setProduct(data))
  } catch (error) {
    dispatch(setError(error.message || 'Error fetching product list'))
  }
}

export default productDetailSlice.reducer
