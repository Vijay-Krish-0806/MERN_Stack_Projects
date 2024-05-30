import React, { useState } from 'react'
import { Form, Button, Container, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { savePaymentMethod } from '../CartSlice'
import CheckoutSteps from '../Components/CheckoutSteps'
const PaymentScreen = () => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart // Correct property name
  const dispatch = useDispatch()
  const navigate = useNavigate()
  if (!shippingAddress) {
    navigate('/shipping')
  }
  const [paymenyMethod, setPaymentMethod] = useState('PayPal')
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymenyMethod))
    navigate('/placeorder')
  }

  return (
    <Container>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check
              type='radio'
              label='PayPal or Credit Card'
              id='PayPal'
              name='paymentMethod'
              value='PayPal'
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <Form.Check
              type='radio'
              label='Stripe'
              id='Stripe'
              name='paymentMethod'
              value='Stripe'
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>
        <Button type='submit' variant='primary' className='mt-2'>
          Continue
        </Button>
      </Form>
    </Container>
  )
}

export default PaymentScreen
