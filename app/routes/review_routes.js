const express = require('express')
const passport = require('passport')

const Listing = require('../models/listing')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

router.post('/reviews/:listingId', requireToken, (req, res, next) => {
  // extract the review from the incoming request's data (req.body)
  const reviewData = req.body.review
  // extract the listing's id that we plan to add a review for
  reviewData.owner = req.user._id
  const listingId = req.params.listingId
  // Find the listing document with the id of `listingId`
  Listing.findById(listingId)
    // throw (cause) a new DocumentNotFoundError to occur, if we couldn't find
    // the listing. Otherwise, pass the listing along to the next `then`
    .then(handle404)
    .then(listing => {
      // add a review to the listing's reviews subdocument array
      listing.reviews.push(reviewData)
      // save the listing (parent) document
      return listing.save()
    })
    // respond w/ the listing we created and a status code of 201 created
    .then(listing => res.status(201).json({ listing }))
    // if an error occurs, run the next middleware, which is the error handling
    // middleware since it is registered last
    .catch(next)
})

router.delete('/reviews/:reviewId/:listingId', requireToken, (req, res, next) => {
  // extract the reviewId and listingId from our route parameters (req.params)
  const { reviewId, listingId } = req.params

  Listing.findById(listingId)
    .then(handle404)
    .then(listing => {
      // select the specific review from the reviews subdocument array then remove it
      const review = listing.reviews.id(reviewId)

      requireOwnership(req, review)

      review.remove()

      // save the listing with the now deleted review
      return listing.save()
    })
    // respond with the status code 204 no content
    .then(() => res.sendStatus(204))
    // if an error occurs, run the next middleware, which is the error handling middleware since it is registered last
    .catch(next)
})

// update a single review
router.patch('/reviews/:reviewId/:listingId', requireToken, removeBlanks, (req, res, next) => {
  // extracting the reviewId and listingId from our route parameters (req.params)
  const { reviewId, listingId } = req.params
  // extract review from the incoming data (req.body)
  const reviewData = req.body.review
  // find the listing
  Listing.findById(listingId)
    .then(handle404)
    .then(listing => {
      // find the specific review in the listing's reviews subdocument array
      const review = listing.reviews.id(reviewId)
      requireOwnership(req, review)
      // update the properties of the review document with the properties
      // from reviewData
      review.set(reviewData)
      // save the updates to our review
      return listing.save()
    })
    // respond with the status code 204 no content
    .then(() => res.sendStatus(204))
    // if an error occurs, call the next middleware
    // the middleware after this route's middleware, is the error handling middleware
    .catch(next)
})
// get a single review
router.get('/reviews/:reviewId/:listingId', requireToken, (req, res, next) => {
  // extracting the reviewId and listingId from our route parameters (req.params)
  const { reviewId, listingId } = req.params

  // find the listing
  Listing.findById(listingId)
    .then(handle404)
    .then(listing => {
      // find the specific review in the listing's reviews subdocument array
      return listing.reviews.id(reviewId)
    })
    // respond with the status code 204 no content
    .then(review => res.json({ review }))
    // if an error occurs, call the next middleware
    // the middleware after this route's middleware, is the error handling middleware
    .catch(next)
})

module.exports = router
