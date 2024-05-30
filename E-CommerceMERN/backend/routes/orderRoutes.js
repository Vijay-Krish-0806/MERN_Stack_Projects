const express = require('express')
const router = express.Router()
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
} = require('../controllers/orderController')

router.post('/orders', addOrderItems)
router.get('/orders/:id', getOrderById)
router.put('/orders/:id/pay', updateOrderToPaid)
module.exports = router
