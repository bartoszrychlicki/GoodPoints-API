const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const mongoose = require('mongoose');
const { TaskType } = require('./taskType');

const schema = {
  reward: { type: Number, required: true, min: -1, max: 2 },
  tasktype: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskType',
    required: true,
  },
  description: { type: String, required: true },
};

const object = new mongoose.model('activityType', schema);

function validate(object) {
  const schema = Joi.object({
    reward: Joi.number().min(-1).max(2).required(),
    tasktype: Joi.objectId().required(),
    description: Joi.string().required(),
  });
  return schema.validate(object);
}

module.exports.ActivityType = object;
module.exports.validate = validate;
