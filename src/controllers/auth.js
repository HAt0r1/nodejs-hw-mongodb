import {
  registration,
  login,
  logout,
  refresh,
  resetWithEmail,
  resetPassword,
} from '../services/auth.js';

export const registrationUserController = async (req, res) => {
  const user = await registration(req.body);

  res.status(200).json({
    status: 200,
    message: 'Successfully registered a user!',
    data: {
      email: user.email,
      name: user.name,
    },
  });
};

export const loginUserController = async (req, res) => {
  const session = await login(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValid,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValid,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logout(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const refreshSessionController = async (req, res) => {
  const session = await refresh(req.cookies);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValid,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValid,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const resetEmailController = async (req, res) => {
  await resetWithEmail(req.body.email);
  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
