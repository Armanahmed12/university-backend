import jwt, { SignOptions } from 'jsonwebtoken';

//expiresIn :  ms.StringValue is the another solution for expiresIn's type
export const createToken = (
  jwtPayload: { userId: string; role: string },
  secret: string,
  expiresIn: string | number
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn } as SignOptions);
};
