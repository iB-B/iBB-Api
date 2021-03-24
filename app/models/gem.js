const mongoose = require('mongoose')
const reviewSchema = require('./review')

const gemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  activity: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: false
  },
  imgSrc: {
    type: String,
    required: true
  },
  imgAlt: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('gem', gemSchema)
