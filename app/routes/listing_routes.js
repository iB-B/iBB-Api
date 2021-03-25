const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in error types and the logic to handle them and set status codes
const errors = require('../../lib/custom_errors')

const handle404 = errors.handle404

const Listing = require('../models/listing')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.listing`
const requireToken = passport.authenticate('bearer', { session: false })

const requireOwnership = errors.requireOwnership

// instantiate a router (mini app that only handles routes)
const router = express.Router()

//
// POST /listings
router.post('/listings', requireToken, (req, res, next) => {
  // set owner of new listing to be the current owner
  req.body.listing.owner = req.user.id

  Listing.create(req.body.listing)
    // respond to successful `create` with status code 201 and JSON of listing
    .then(listing => {
      res.status(201).json({ listing: listing.toObject() })
    })
    // catch any errors
    .catch(next)
})

// INDEX
// GET /listings
router.get('/listings', (req, res, next) => {
  Listing.find()
    .then(listings => {
      // `listings` will be an array of Mongoose documents
      // we want to convert to POJO, then .map
      return listings.map(listing => listing.toObject())
    })
    .then(listings => res.status(200).json({ listings: listings }))
    // catch any errors
    .catch(next)
})

// SHOW
// GET /listings/:id
router.get('/listings/:id', (req, res, next) => {
  const id = req.params.id

  Listing.findOne({ _id: id })
    .then(handle404)
    // if `findById` is successful, respond with 200 and "listing" JSON
    .then(listing => res.status(200).json({ listing: listing.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// update listing (comment on it)
// PATCH /puchases/:id
router.patch('/listings/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  const listingData = req.body.listing
  delete listingData.owner
  // `req.listing` will be determined by decoding the token payload
  Listing.findById({ _id: id })
    .then(errors.handle404)
    .then(listing => {
      requireOwnership(req, listing)
      return listing.updateOne(listingData)
    })

    // respond with no content and status 200
    // .then(() => res.sendStatus(204))
    .then(listing => res.status(204).json({ comment: listing.comment }))
    // pass any errors along to the error handler
    .catch(next)
})

// DESTROY
router.delete('/listings/:id', requireToken, (req, res, next) => {
  Listing.findOne({ _id: req.params.id })
    .then(handle404)
    .then(listing => {
      // throw an error if current user doesn't own `listing`
      requireOwnership(req, listing)
      // delete the listing ONLY IF the above didn't throw
      return listing.updateOne({ comment: '' })
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
