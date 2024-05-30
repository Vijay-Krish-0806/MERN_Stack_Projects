import React from 'react'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import Footer from './Components/Footer'
import { Container } from 'react-bootstrap'
import { Header } from './Components/Header'
import HomeScreen from './Screens/HomeScreen'
import ProductScreen from './Screens/ProductScreen'
import CartScreen from './Screens/CartScreen'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Signup } from './Components/Signup'
import { Signin } from './Components/Signin'
import { Forget } from './Components/Forget'
import { Activate } from './Components/Activate'
import { Private } from './Components/Private'
import { Reset } from './Components/Reset'
import ShippingScreen from './Screens/ShippingScreen'
import PaymentScreen from './Screens/PaymentScreen'
import PlaceOrderScreen from './Screens/PlaceOrderScreen'
import OrderScreen from './Screens/OrderScreen'
const App = () => {
  return (
    <Router>
      <Header />
      <main>
        <Container>
          <PayPalScriptProvider
            options={{
              clientId: 'test',
              components: 'buttons',
              currency: 'USD',
            }}
          >
            <Routes>
              <Route path='/' exact element={<HomeScreen />} />
              <Route path='/product/:id' element={<ProductScreen />} />
              <Route path='/cart/:id?' element={<CartScreen />} />
              <Route path='/signup' exact element={<Signup />} />
              <Route path='/signin' exact element={<Signin />} />
              <Route path='/shipping' exact element={<ShippingScreen />} />
              <Route path='/placeorder' exact element={<PlaceOrderScreen />} />
              <Route path='/order/:orderId' exact element={<OrderScreen />} />
              <Route path='/payment' exact element={<PaymentScreen />} />
              <Route
                path='/auth/activate/:token'
                exact
                element={<Activate />}
              />
              <Route path='/private' exact element={<Private />} />
              <Route path='/auth/password/forget' exact element={<Forget />} />
              <Route
                path='/auth/password/reset/:token'
                exact
                element={<Reset />}
              />
            </Routes>
          </PayPalScriptProvider>
        </Container>
      </main>
      <Footer />
    </Router>
  )
}

export default App
