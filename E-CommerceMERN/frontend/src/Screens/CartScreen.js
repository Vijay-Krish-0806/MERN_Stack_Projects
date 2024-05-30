import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../Components/Message'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { isAuth } from '../Components/Helpers'
import { addToCart, removeFromList } from '../CartSlice'

const CartScreen = () => {
  const { id } = useParams()
  const location = useLocation()
  const qty = location.search ? Number(location.search.split('=')[1]) : 1
  const dispatch = useDispatch()

  useEffect(() => {
    if (id) {
      dispatch(addToCart(id, qty))
    }
  }, [dispatch, id, qty])
  const { cartItems } = useSelector((state) => state.cart)
  // const  {cartItems} = cart
  // console.log(cartItems)
  const navigate = useNavigate()
  const checkoutHandler = () => {
    if (!isAuth()) {
      navigate('/signin?redirect=shipping')
    } else {
      navigate('/signin?redirect=shipping')
      navigate('/shipping')
    }
  }
  const handleRemoveFromCart = (id) => {
    dispatch(removeFromList(id))
  }
  return (
    <>
      {isAuth() ? (
        <Row>
          <Col md={8}>
            <h1>Shopping cart</h1>
          </Col>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is Empty
              <Link
                style={{ textDecoration: 'none', fontSize: '0.7rem' }}
                to='/'
                className='btn btn-dark m-1'
              >
                Go Back
              </Link>
            </Message>
          ) : (
            <ListGroup variant='flush'>
              {cartItems.map((item) => (
                <ListGroup.Item key={item.product._id}>
                  <Row>
                    <Col md={2}>
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        style={{ objectFit: 'cover', height: 200, width: 200 }}
                        fluid
                        rounded
                      ></Image>
                    </Col>
                    <Col md={3}>
                      <Link
                        style={{ textDecoration: 'none', color: 'black' }}
                        to={`/product/${item.product._id}`}
                      >
                        {item.product.name}
                      </Link>
                    </Col>
                    <Col md={2}>
                      <Form.Control
                        as='select'
                        value={item.qty}
                        onChange={(e) => {
                          dispatch(
                            addToCart(item.product._id, Number(e.target.value))
                          )
                        }}
                      >
                        {[...Array(item.product.countInStock).keys()].map(
                          (x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          )
                        )}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <Button
                        type='button'
                        variant='light'
                        onClick={() => handleRemoveFromCart(item.product._id)}
                      >
                        <i className='fas fa-trash'></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          <Col>
            <Card className='my-3 p-3 rounded'>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>
                    Subtotal (
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                  </h3>
                  $
                  {cartItems
                    .reduce(
                      (acc, item) => acc + item.qty * item.product.price,
                      0
                    )
                    .toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type='button'
                    className='btn-block'
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed to Checkout
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      ) : (
        <p>
          <h1>Please sign in to see your cart items</h1>
          <Link to='/signin' className='btn btn-dark'>
            Signin
          </Link>
        </p>
      )}
    </>
  )
}

export default CartScreen
