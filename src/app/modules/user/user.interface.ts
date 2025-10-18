import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant.js';

export interface IUser {
  _id: string;
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'admin' | 'faculty' | 'student';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export interface UserModel extends Model<IUser> {
  doesUserExistByCustomId(is: string): Promise<IUser | null>;
  doesPasswordMatch(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  wasJWTIssuedBeforePasswordChange(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
