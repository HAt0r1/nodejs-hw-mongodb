import createHttpError from 'http-errors';

import {
  userFilter,
  registration,
  createSession,
  logoutUser,
  sessionFilter,
  refreshSession,
} from '../services/auth.js';
import { comparePassword } from '../utils/comparePassword.js';

export const registrationUserController = async (req, res, next) => {
  const { email } = req.body;
  const isValidUser = await userFilter({ email });
  if (isValidUser) {
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
    message: 'Successfully registered a user!',
    data,
  });
};

export const loginUserController = async (req, res, next) => {
  const { email, password } = req.body;
  const isValidUser = await userFilter({ email });
  if (!isValidUser) {
    next(createHttpError(404, 'User with current email not found'));
    return;
  }

  const isValidPassword = await comparePassword(password, isValidUser.password);

  if (!isValidPassword) {
    next(createHttpError(401, 'Unauthorized'));
    return;
  }

  const sessionData = await createSession(isValidUser._id);

  res.cookie('refreshToken', sessionData.refreshToken, {
    httpOnly: true,
    expires: sessionData.refreshTokenValid,
  });

  res.cookie('sessionId', sessionData._id, {
    httpOnly: true,
    expires: sessionData.refreshTokenValid,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: sessionData.accessToken,
  });
};

export const refreshSessionController = async (req, res, next) => {
  const { sessionId, refreshToken } = req.cookies;
  const session = await sessionFilter({ _id: sessionId, refreshToken });
  if (!session) {
    return next(401, 'Session with current id not found');
  }

  const validToken = new Date() > new Date(session.refreshTokenValid);
  if (validToken) {
    return next(401, 'Current token expired');
  }

  const newSession = await refreshSession(session.userId);

  res.cookie('refreshToken', newSession.refreshToken, {
    httpOnly: true,
    expires: newSession.refreshTokenValid,
  });

  res.cookie('sessionId', newSession._id, {
    httpOnly: true,
    expires: newSession.refreshTokenValid,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: newSession.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
