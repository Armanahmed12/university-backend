import jwt, { SignOptions } from 'jsonwebtoken';
import { MyJwtPayload } from '../../interface/index.js';

//expiresIn :  ms.StringValue is the another solution for expiresIn's type
export const createToken = (
  jwtPayload: { userId: string; role: string },
  secret: string,
  expiresIn: string | number
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as MyJwtPayload;
};
