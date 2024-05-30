const express = require('express')
require('dotenv').config()
const connectToMongo = require('./config/db')
const { notFound, errorHandler } = require('./middleware/middleware')
const cors = require('cors')
const bodyParser = require('body-parser')

connectToMongo()
const app = express()

//import routes
const productRoutes = require('./routes/productRoutes')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const orderRoutes = require('./routes/orderRoutes')

//app middlewares
app.use(bodyParser.json())
app.use(cors())
if ((process.env.NODE_ENV = 'development')) {
  app.use(cors({ origin: 'http://localhost:3000' }))
}

app.get('/api/config/paypal', (req, res) => {
  const paypalClientId = process.env.PAYPAL_CLIENT_ID

  if (paypalClientId) {
    res.send(paypalClientId)
  } else {
    res.status(500).json({ error: 'PayPal client ID not configured.' })
  }
})
app.get('/', (req, res) => {
  res.send('API is Running...')
})

//middlewares
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api', orderRoutes)
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server running on port ${PORT}`))
