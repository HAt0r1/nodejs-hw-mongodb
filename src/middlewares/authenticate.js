import createHttpError from 'http-errors';
import Session from '../db/model/Session.js';
import User from '../db/model/User.js';

export const authenticate = async (req, res, next) => {
  const autorization = req.get('Authorization');
  if (!autorization) {
    return next(createHttpError(401, 'Authorization header does not found'));
  }

  const [bearer, token] = autorization.split(' ');

  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'Token must be a Bearer type'));
  }

  if (!token) {
    return next(createHttpError(401, 'Token not found'));
  }

  const session = await Session.findOne({ accessToken: token });

  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  const isAccessTokenExpired = new Date() > new Date(session.accessTokenValid);

  if (isAccessTokenExpired) {
    next(createHttpError(401, 'Access token expired'));
  }

  const user = await User.findById(session.userId);

  if (!user) {
    next(createHttpError(401, 'User with current id dont has session'));
    return;
  }

  req.user = user;

  next();
};
