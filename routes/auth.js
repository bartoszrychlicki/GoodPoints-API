const Joi = require('joi')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const { User } = require('../models/user')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')

//const config = require('config');
//const auth = require('../middleware/auth');

router.post('/', async function (req, res) {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('Invalid email or password')

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send('Invalid email or password')

  const token = user.generateAuthToken()

  //returning token in header and user object as a response
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']))
})

function validate(request) {
  const schema = Joi.object({
    email: Joi.string().required().min(5).email(),
    password: Joi.string().required().max(50),
  })
  return schema.validate(request)
}

module.exports = router
