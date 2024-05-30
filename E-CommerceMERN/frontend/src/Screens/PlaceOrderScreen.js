import React, { useEffect } from 'react'
import { Button, Row, Col, Image, Card, ListGroup } from 'react-bootstrap'
import CheckoutSteps from '../Components/CheckoutSteps'
import Message from '../Components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { orderList } from '../OrderSlice'

const PlaceOrderScreen = () => {
  const dispatch = useDispatch()
  let cart = useSelector((state) => state.cart)
  // console.log(cart)
  //calculate prices
  //   cart.itemsPrice = cart.cartItems.reduce(
  //     (acc, item) => acc + item.qty * item.product.price,
  //     0
  //   )
  const itemsPrice = cart.cartItems
    .reduce((acc, item) => acc + item.qty * item.product.price, 0)
    .toFixed(2)

  const shippingPrice = itemsPrice > 100 ? 0 : 100
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2))
  const totalPrice =
    Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)
  cart = {
    ...cart,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  }
  const orderCreate = useSelector((state) => state.orders)
  const { loading, error, order } = orderCreate
  // console.log(loading, error, order)
  const user = JSON.parse(localStorage.getItem('user'))
  const user_id = user._id
  const navigate = useNavigate()
  useEffect(() => {
    if (order._id) {
      navigate(`/order/${order._id}`)
    }
  }, [navigate, loading, order._id])
  const placeOrderHandler = (e) => {
    e.preventDefault()
    dispatch(
      orderList({
        user: user_id,
        orderItems: cart.cartItems.map((item) => ({
          name: item.product.name,
          qty: item.qty,
          image: item.product.image,
          price: item.product.price,
          product: item.product._id,
        })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    )
  }
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup varinat='flush'>
            <ListGroup.Item>
              <h2>Shopping</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address},{cart.shippingAddress.city},
                {cart.shippingAddress.postalCode},{cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method:</strong>
              {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message variant='blue'>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1} sm={1}>
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fluid
                            rounded
                          ></Image>
                        </Col>
                        <Col>
                          <Link
                            style={{ textDecoration: 'none' }}
                            to={`/product/${item.product._id}`}
                          >
                            {item.product.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.product.price}=$
                          {(item.qty * item.product.price).toFixed(2)}
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
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant='danger'>{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen
