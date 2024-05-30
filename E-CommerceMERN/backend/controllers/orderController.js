const asyncHandler = require('express-async-handler')
const Order = require('../models/orderModel')

//create new Order
exports.addOrderItems = asyncHandler(async (req, res) => {
  const {
    user,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body.order

  if (orderItems.length === 0) {
    console.log('order items empty')
    return res.status(400).json({
      error: 'Error in placing orders',
    })
  } else {
    const order = new Order({
      user,
      orderItems: [...orderItems],
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })
    await order
      .save()
      .then((savedOrder) => {
        console.log('order is placed')
        return res.status(200).json({
          message: 'order details are updated',
          _id: savedOrder._id,
        })
      })
      .catch((error) => {
        console.log(error)
        return res.status(401).json({
          error: 'unable to update to database',
        })
      })
  }
})

exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )
  if (order) {
    console.log('Can find order')
    return res.json(order)
  } else {
    console.log('Cannot find order')
    return res.status(400).json({
      error: "Can't find order",
    })
  }
})

exports.updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    console.log('Can find order')
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.orderId,
      status: 'Completed',
      // update_time: req.body.updated_time,
      // email_address: req.body.payer.email_address,
    }
    await order
      .save()
      .then((updatedOrder) => {
        console.log('order is updated')
        return res.status(200).json({
          updatedOrder,
        })
      })
      .catch((error) => {
        console.log(error)
        return res.status(401).json({
          error: 'unable to update to database',
        })
      })
  } else {
    console.log('Cannot find order')
    return res.status(400).json({
      error: "Can't find order",
    })
  }
})
