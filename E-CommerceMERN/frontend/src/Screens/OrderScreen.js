import React, { useEffect, useState } from 'react'
import { Row, Col, Image, Card, ListGroup } from 'react-bootstrap'
// import { PayPalButton } from 'react-paypal-button-v2'
import { PayPalButtons } from '@paypal/react-paypal-js'
import Loader from '../Components/Loader'
import Message from '../Components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { orderDetailList } from '../OrderDetailSlice'
import { orderPayAction, reset } from '../OrderPaySlice'
import axios from 'axios'

const OrderScreen = () => {
  const [sdkReady, setSdkReady] = useState(false)
  const { orderId } = useParams()
  const dispatch = useDispatch()
  const orderItem = useSelector((state) => state.orderDetails)
  const { orderItems, loading, error } = orderItem
  const orderPayState = useSelector((state) => state.orderPay)
  const { success, loading: loadingPay } = orderPayState

  let itemsPrice = 0
  if (!loading) {
    itemsPrice = orderItems.orderItems
      .reduce((acc, item) => acc + item.qty * item.price, 0)
      .toFixed(2)
  }

  useEffect(() => {
    const addPayPalScript = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/config/paypal'
        )
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.async = true
        script.src = `https://www.paypal.com/sdk/js?client-id=${response.data}`
        script.onload = () => {
          setSdkReady(true)
        }
        document.body.appendChild(script)
      } catch (error) {
        console.error('Error fetching PayPal config:', error.message)
      }
    }
    if (!orderItems || success) {
      dispatch(reset())
      dispatch(orderDetailList(orderId))
    } else if (!orderItems.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
    // dispatch(orderDetailList(orderId))
  }, [orderId, dispatch, success, orderItems, loadingPay])
  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult)
    dispatch(orderPayAction(orderId, paymentResult))
  }
  const createOrder = (data, actions) => {
    // Logic to create an order on your server and return the order ID
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: orderItems.totalPrice,
          },
        },
      ],
    })
  }
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1>Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <ListGroup varinat='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <strong>
                Name:<strong>{orderItems.user.name}</strong>
              </strong>
              &nbsp;
              <a href={`mailto:${orderItems.user.email}`}>
                {orderItems.user.email}
              </a>
              <p>
                <strong>Address:</strong>
                {orderItems.shippingAddress.address},
                {orderItems.shippingAddress.city},
                {orderItems.shippingAddress.postalCode},
                {orderItems.shippingAddress.country}
              </p>
              {orderItems.isDeliverd ? (
                <Message variant='sucess'>
                  Delivered on {orderItems.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method:</strong>
                {orderItems.paymentMethod}
              </p>
              {orderItems.isPaid ? (
                <Message variant='success'>Paid on {orderItems.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {orderItems.orderItems.length === 0 ? (
                <Message variant='blue'>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {orderItems.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1} sm={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          ></Image>
                        </Col>
                        <Col>
                          <Link
                            style={{ textDecoration: 'none' }}
                            to={`/product/${item.product._id}`}
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price}=$
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup varinat='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${orderItems.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${orderItems.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${orderItems.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!orderItems.isPaid && (
                <ListGroup.Item>
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButtons
                      disabled={false}
                      createOrder={createOrder}
                      onApprove={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
