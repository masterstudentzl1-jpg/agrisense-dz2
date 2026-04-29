const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/products', require('./routes/products'))
app.use('/api/farms', require('./routes/farms'))

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log(err))

app.listen(5000, () => console.log('🚀 Server running on port 5000'))