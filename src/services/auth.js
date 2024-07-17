import createHttpError from 'http-errors';
import User from '../db/model/User.js';
import Session from '../db/model/Session.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '../utils/env.js';
import { randomBytes } from 'node:crypto';
import {
  TIMELINE_ACCESS_TOKEN,
  TIMELINE_REFRESH_TOKEN,
} from '../constans/sessionParams.js';
import { sendEmail } from '../utils/resetWithEmail.js';
import { TEMPLATES } from '../constans/links.js';

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

export const resetWithEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  const resetToken = jwt.sign({ sub: user._id, email }, env('JWT_SECRET'), {
    expiresIn: '5min',
  });
  const templatePath = path.join(TEMPLATES, 'reset-password-email.html');

  const templateContent = (await fs.readFile(templatePath)).toString();

  const template = handlebars.compile(templateContent);

  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });
  try {
    await sendEmail({
      from: env('SMTP_FROM'),
      to: email,
      subject: 'Reset current password',
      html,
    });
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async ({ token, password }) => {
  let entries;

  try {
    entries = jwt.verify(token, env('JWT_SECRET'));
  } catch (error) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await User.findOne({ _id: entries.sub, email: entries.email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await User.updateOne({ _id: user.id }, { password: hashPassword });
};
