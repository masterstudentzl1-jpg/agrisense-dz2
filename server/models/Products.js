const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  icon: String,
  category: String,
  inStock: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model('Product', ProductSchema)