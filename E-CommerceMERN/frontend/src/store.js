import { configureStore } from '@reduxjs/toolkit'
import productSlice from './productSlice'
import cartSlice from './CartSlice'
import productDetailSlice from './productDetailSlice'
import orderSlice from './OrderSlice'
import orderDetailsSlice from './OrderDetailSlice'
import orderPaySlice from './OrderPaySlice'

export default configureStore({
  reducer: {
    productList: productSlice,
    productDetails: productDetailSlice,
    cart: cartSlice,
    orders: orderSlice,
    orderDetails: orderDetailsSlice,
    orderPay: orderPaySlice,
  },
})
