import Joi from 'joi';

export const createStudentSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  photo: Joi.string(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().min(3).max(20).valid('personal', 'work', 'home'),
});

export const updateStudentSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  photo: Joi.string(),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().min(3).max(20).valid('personal', 'work', 'home'),
});
