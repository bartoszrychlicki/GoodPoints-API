const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const _ = require('lodash')
const { User, validate } = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//const config = require('config');
//nconst auth = require('../middleware/auth');

router.get('/me', auth, async function (req, res) {
  const user = await User.findById(req.user._id).select('-password')
  res.send(user)
})

router.post('/', async function (req, res) {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).send('This user is already registered')

  user = new User(_.pick(req.body, ['name', 'email', 'password']))
  try {
    // hashing password
    const salt = await bcrypt.genSalt()
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()
    const token = user.generateAuthToken()
    res
      .header('x-auth-token', token)
      .send(_.pick(user, ['_id', 'name', 'email']))
  } catch (err) {
    console.log('Error while saving user to DB...', err)
    return res.status(500)
  }
})

module.exports = router
