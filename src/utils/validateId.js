import { isValidObjectId } from 'mongoose';

import createHttpError from 'http-errors';

export const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    next(createHttpError(404), `Contact with ${id} id not found`);
    return;
  }

  next();
};
