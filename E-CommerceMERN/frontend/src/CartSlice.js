// cartSlice.js
import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : []
const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {}
const paymentMethod = localStorage.getItem('paymentMethod')
  ? JSON.parse(localStorage.getItem('paymentMethod'))
  : ''

const initialState = {
  cartItems: [...cartItemsFromStorage],
  shippingAddress: { ...shippingAddressFromStorage }, // Change to an object
  paymentMethod: paymentMethod,
}

const cartSlice = createSlice({
  name: 'cartSlice',
  initialState,
  reducers: {
    cartAddItem: (state, action) => {
      const item = action.payload

      const existItem = state.cartItems.find(
        (x) => x.product._id === item.product._id
      )
      if (existItem) {
        // Update the existing item in the cart
        state.cartItems = state.cartItems.map((x) =>
          x.product._id === existItem.product._id ? item : x
        )
      } else {
        // Add the new item to the cart
        state.cartItems = [...state.cartItems, item]
      }
    },
    removeFromCart: (state, action) => {
      const productId = action.payload
      state.cartItems = state.cartItems.filter(
        (item) => item.product._id !== productId
      )
    },
    saveAddress: (state, action) => {
      state.shippingAddress = action.payload
    },
    savePaymentType: (state, action) => {
      state.paymentMethod = action.payload
    },
  },
})

export const { cartAddItem, removeFromCart, saveAddress, savePaymentType } =
  cartSlice.actions

export const addToCart = (id, qty) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`/api/products/${id}`)
    dispatch(cartAddItem({ product: data, qty }))
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
  } catch (error) {
    console.log(error)
  }
}

export const removeFromList = (id) => (dispatch, getState) => {
  try {
    dispatch(removeFromCart(id)) // Pass productId directly
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
  } catch (error) {
    console.log(error)
  }
}

export const saveShippingAddress = (data) => (dispatch) => {
  try {
    dispatch(saveAddress(data)) // Pass data directly
    localStorage.setItem('shippingAddress', JSON.stringify(data))
  } catch (error) {
    console.log(error)
  }
}
export const savePaymentMethod = (data) => (dispatch) => {
  try {
    dispatch(savePaymentType(data)) // Pass data directly
    localStorage.setItem('paymentMethod', JSON.stringify(data))
  } catch (error) {
    console.log(error)
  }
}

export default cartSlice.reducer
