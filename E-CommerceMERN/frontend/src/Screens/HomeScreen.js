// Homescreen.js
import React, { useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import Product from '../Components/Product'
import Loader from '../Components/Loader'
import Message from '../Components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../productSlice'

const HomeScreen = () => {
  const dispatch = useDispatch()
  const list = useSelector((state) => state.productList)
  const { loading, error, products } = list
  // console.log(products)

  useEffect(() => {
    dispatch(listProducts())
  }, [dispatch])

  return (
    <div>
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default HomeScreen
