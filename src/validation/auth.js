import Joi from 'joi';

export const registrationValidation = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().max(20).required(),
  password: Joi.string().min(6).max(20).required(),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().max(20).required(),
  password: Joi.string().min(6).max(20).required(),
});
