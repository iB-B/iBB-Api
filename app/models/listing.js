const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  dateAvail: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  // only the owner can edit the listing.
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toObject: {
    // remove `hashedPassword` field when we call `.toObject`
    transform: (_doc, listing) => {
      return {
        id: listing._id,
        location: listing.location,
        dateAvail: listing.dateAvail,
        date: listing.date.toDateString(),
        price: listing.price,
        description: listing.description
      }
    }
  }
})

module.exports = mongoose.model('listing', listingSchema)

