const express = require('express');
//const auth = require('../middleware/auth');
//const admin = require('../middleware/admin');
const router = express.Router();
const mongoose = require('mongoose');
const { Category, validate } = require('../models/category');

router.get('/', async (req, res) => {
  const genres = await Genre.find();
  res.send(genres);
});

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    return res.status(404).send('The genre with the given ID was not found.');
  }

  res.send(genre);
});

router.post('/', async function (req, res) {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = new Category(req.body);
  await category.save();

  res.send(category);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const result = await Genre.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!result)
      return res
        .status(404)
        .send('The category with the given ID was not found.');
    res.send(result);
  } catch (err) {
    console.log('Error ', err);
  }
  // const genre = genres.find((c) => c.id === parseInt(req.params.id));

  //const { error } = validate(req.body);
  //if (error) return res.status(400).send(error.details[0].message);
});

router.delete('/:id', async (req, res) => {
  const cateogry = await Cateogry.findByIdAndRemove(req.params.id);

  if (!cateogry) {
    return res.status(404).send('The genre with the given ID was not found.');
  }

  res.send(cateogry);
});

module.exports = router;