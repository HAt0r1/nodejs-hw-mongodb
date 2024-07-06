import User from '../db/model/User.js';
import Session from '../db/model/Session.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import {
  TIMELINE_ACCESS_TOKEN,
  TIMELINE_REFRESH_TOKEN,
} from '../constans/sessionParams.js';

export const userFilter = (filter) => User.findOne(filter);

export const registration = async (payload) => {
  const { password } = payload;
  const encryptPassword = await bcrypt.hash(password, 10);

  return User.create({ ...payload, password: encryptPassword });
};

export const createSession = async (userId) => {
  await Session.deleteOne({ userId: userId });
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValid = new Date(Date.now() + TIMELINE_ACCESS_TOKEN);
  const refreshTokenValid = new Date(Date.now() + TIMELINE_REFRESH_TOKEN);

  return Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValid,
    refreshTokenValid,
  });
};

export const logoutUser = (userId) => {
  Session.deleteOne({ _id: userId });
};
