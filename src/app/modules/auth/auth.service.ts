import AppError from '../../errors/AppError.js';
import { User } from '../user/user.model.js';
import { TLoginUser } from './auth.interface.js';
import httpStatus from 'http-status';
import { createToken, verifyToken } from './auth.utils.js';
import { config } from '../../config/index.js';
import { MyJwtPayload } from '../../interface/index.js';
import bcrypt from 'bcrypt';
import { SendEmail } from '../../utils/sendEmail.js';

const loginUser = async (payload: TLoginUser) => {
  const { id } = payload;
  const user = await User.doesUserExistByCustomId(id);
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No user is found with the given Id'
    );
  }
  //  check whether the user is deleted
  if (user.isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'This User is deleted!');
  }

  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This User is blocked!');
  }

  const doesPasswordMatch = await User.doesPasswordMatch(
    payload.password,
    user.password
  );

  if (!doesPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, "Password doesn't match");
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: MyJwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const user = await User.doesUserExistByCustomId(userData.userId);
  const doesPasswordMatch = await User.doesPasswordMatch(
    payload?.oldPassword,
    user?.password as string
  );

  if (!doesPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Old pasw is not correct');
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    }
  );

  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userId, iat } = decoded;
  const user = await User.doesUserExistByCustomId(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  if (
    user.passwordChangedAt &&
    (await User.wasJWTIssuedBeforePasswordChange(
      user?.passwordChangedAt,
      iat as number
    ))
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (userId: string) => {
  const user = await User.doesUserExistByCustomId(userId);

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No user Found with the given userId'
    );
  }
  //  check if the user is Deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }
  // check if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m' as string
  );

  const resetUILink = `${config.reset_pass_ui_link}?id:${user.id}&token=${resetToken}`;
  SendEmail(user.email, resetUILink);
  // console.log(resetToken);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string
) => {
  //  checking if the user exist
  const user = await User.doesUserExistByCustomId(payload?.id);

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No user found with the given user id'
    );
  }
  //  check if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This User is deleted');
  }

  // verify if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  const decoded = verifyToken(token, config.jwt_access_secret as string);

  // make sure if the userid is similar to the token's userid
  if (payload.id !== decoded.userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden');
  }

  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    }
  );
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
