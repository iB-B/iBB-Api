// const express = require('express')
// const passport = require('passport')

// const Gem = require('../models/gem')

// const customErrors = require('../../lib/custom_errors')

// const handle404 = customErrors.handle404
// const requireOwnership = customErrors.requireOwnership

// const removeBlanks = require('../../lib/remove_blank_fields')
// const requireToken = passport.authenticate('bearer', { session: false })

// const router = express.Router()

// router.get('/gems', requireToken, (req, res, next) => {
//   Gem.find()
//     .then(gems => {
//       res.json({ gems })
//     })
//     .catch(next)
// })

// router.patch('/gems/:id', requireToken, removeBlanks, (req, res, next) => {
//   // block attempts to change ownership
//   delete req.body.gem.owner

//   Gem.findById(req.params.id)
//     .then(handle404)
//     .then(gem => {
//       // throw an error if attempt to update when not the owner
//       requireOwnership(req, gem)

//       // pass the result
//       return gem.updateOne(req.body.gem)
//     })
//     // success -> status 204
//     .then(() => res.sendStatus(204))
//     // if error
//     .catch(next)
// })

// router.post('/gems', requireToken, (req, res, next) => {
//   req.body.gem.owner = req.user.id

//   Gem.create(req.body.gem)
//     .then(gem => {
//       res.status(201).json({ gem: gem.toObject() })
//     })
//     .catch(next)
// })

// // SHOW Gem
// router.get('/gems/:id', requireToken, (req, res, next) => {
//   // req.params.id will be set based on the
//   // :id in the route
//   Gem.findById(req.params.id)
//     .then(handle404)
//     // if you can find by id, respond (200)
//     // and send the client some json
//     .then(gem => res.status(200).json({ gem: gem }))
//     // if error, pass to handler
//     .catch(next)
// })

// // DELETE Gem
// router.delete('/gems/:id', requireToken, (req, res, next) => {
//   Gem.findById(req.params.id)
//     .then(handle404)
//     .then(gem => {
//       // throw error if they dont own purchase
//       requireOwnership(req, gem)
//       gem.deleteOne()
//     })
//     // send back (204) with no need for JSON
//     .then(() => res.sendStatus(204))
//     // send to error handler on errors
//     .catch(next)
// })

// module.exports = router