import User from '../db/model/User.js';
import bcrypt from 'bcrypt';

export const userFilter = (filter) => User.findOne({ filter });

export const registration = async (payload) => {
  const { password } = payload;
  const encryptPassword = await bcrypt.hash(password, 10);

  return User.create({ ...payload, password: encryptPassword });
};
