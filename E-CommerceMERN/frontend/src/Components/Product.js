import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      {product.name}

      <Link to={`/product/${product._id}`}>
        <Card.Img
          src={product.image}
          variant='top'
          style={{ objectFit: 'cover', height: 200, width: 200 }}
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          ></Rating>
        </Card.Text>
        <Card.Text as='div'>${product.price}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
