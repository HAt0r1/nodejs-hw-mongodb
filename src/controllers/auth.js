import createHttpError from 'http-errors';

import { userFilter, registration } from '../services/auth.js';

export const registrationUserController = async (req, res, next) => {
  const { email } = req.body;
  const isValidEmail = await userFilter(email);
  if (isValidEmail) {
    next(createHttpError(409, 'User with current email already exist'));
    return;
  }

  const userInfo = await registration(req.body);

  const data = {
    name: userInfo.name,
    email: userInfo.email,
  };

  res.status(201).json({
    status: 201,
    message: 'Succesfull created user',
    data,
  });
};
