import bcrypt from 'bcrypt';

export const comparePassword = (userPassword, dbPassword) => {
  const compareResult = bcrypt.compare(userPassword, dbPassword);
  return compareResult;
};
