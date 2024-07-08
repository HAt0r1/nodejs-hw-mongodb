import createHttpError from 'http-errors';
import User from '../db/model/User.js';
import Session from '../db/model/Session.js';
import { randomBytes } from 'node:crypto';
import bcrypt from 'bcrypt';
import {
  TIMELINE_ACCESS_TOKEN,
  TIMELINE_REFRESH_TOKEN,
} from '../constans/sessionParams.js';

const userFilter = (filter) => User.findOne(filter);

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValid: new Date(Date.now() + TIMELINE_ACCESS_TOKEN),
    refreshTokenValid: new Date(Date.now() + TIMELINE_REFRESH_TOKEN),
  };
};

export const registration = async ({ email, name, password }) => {
  const isValidEmail = await userFilter({ email });
  if (isValidEmail) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  return User.create({
    email,
    name,
    password: hashPassword,
  });
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'User with current email does not exist');
  }
  const isEqual = await bcrypt.compare(password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await Session.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValid: new Date(Date.now() + TIMELINE_ACCESS_TOKEN),
    refreshTokenValid: new Date(Date.now() + TIMELINE_REFRESH_TOKEN),
  });
};

export const logout = (payload) => {
  return Session.deleteOne({ _id: payload });
};

export const refresh = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({ _id: sessionId, refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isValidToken = new Date() > new Date(session.refreshTokenValid);

  if (isValidToken) {
    throw createHttpError(401, 'Current token expired');
  }

  const newSession = createSession();

  Session.deleteOne({ _id: sessionId, refreshToken });

  return Session.create({
    userId: session.userId,
    ...newSession,
  });
};
