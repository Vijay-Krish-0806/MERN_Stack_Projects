// productSlice.js
import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  loading: false,
  products: [],
  error: null,
}

const productSlice = createSlice({
  name: 'productSlice',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.loading = false
      state.products = action.payload
      state.error = null
    },
    setLoading: (state) => {
      state.loading = true
      state.products = []
      state.error = null
    },
    setError: (state, action) => {
      state.loading = false
      state.products = []
      state.error = action.payload
    },
  },
})

export const { setProducts, setLoading, setError } = productSlice.actions

export const listProducts = () => async (dispatch) => {
  try {
    dispatch(setLoading())
    const { data } = await axios.get('/api/products')
    dispatch(setProducts(data))
  } catch (error) {
    dispatch(setError(error.message || 'Error fetching product list'))
  }
}

export default productSlice.reducer
