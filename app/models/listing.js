const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  stateProvince: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  latitude: {
    type: String,
    required: false
  },
  longitude: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
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
        name: listing.name,
        address: listing.address,
        city: listing.city,
        stateProvince: listing.stateProvince,
        postalCode: listing.postalCode,
        latitude: listing.latitude,
        longitude: listing.longitude,
        price: listing.price,
        description: listing.description,
        date: listing.date.toDateString()
      }
    }
  }
})

module.exports = mongoose.model('listing', listingSchema)
