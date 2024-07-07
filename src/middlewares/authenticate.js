import createHttpError from 'http-errors';
import Session from '../db/model/Session.js';

import { sessionFilter } from '../services/auth.js';

const authenticate = async (req, res, next) => {
  const header = req.get('Authorization');
  if (!header) {
    return next(createHttpError(401, 'Autorization header does not exist'));
  }

  const [bearer, token] = header.split(' ');

  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'This token has not bearer type'));
  }

  if (!token) {
    return next(createHttpError(401, 'Token not found'));
  }

  const session = await sessionFilter({ accessToken: token });

  if (!session) {
    return next(createHttpError(401, 'Session with current token not found'));
  }

  const validAccessToken = new Date() > new Date(session.accessTokenValid);

  if (validAccessToken) {
    return next(401, 'Access token expires');
  }

  const isValidUser = await Session.findById(session.userId);

  if (!isValidUser) {
    return next(401, 'User with current id does not exist');
  }

  req.user = isValidUser;

  next();
};

export default authenticate;
