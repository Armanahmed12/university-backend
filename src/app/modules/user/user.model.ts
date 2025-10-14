import { model, Schema } from 'mongoose';
import { IUser, UserModel } from './user.interface.js';
import bcrypt from 'bcrypt';
import { config } from '../../config/index.js';

const userSchema = new Schema<IUser>(
  {
    id: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: 0 },
    needsPasswordChange: { type: Boolean, default: true },
    passwordChangedAt: { type: Date },
    role: {
      type: String,
      enum: ['admin', 'faculty', 'student'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,

    statics: {
      async doesUserExistByCustomId(id: string) {
        return await this.findOne({ id }).select('+password');
      },
      async doesPasswordMatch(
        plainTextPassword: string,
        hashedPassword: string
      ) {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
      },
      async wasJWTIssuedBeforePasswordChange(
        passwordChangedTimestamp: Date,
        jwtIssuedTimestamp: number
      ) {
        const passwordChangedTime =
          new Date(passwordChangedTimestamp).getTime() / 1000;

        return passwordChangedTime > jwtIssuedTimestamp;
      },
    },
  }
);

// pre save middleware
userSchema.pre('save', async function (next) {
  const user = this as IUser;

  // Only hash the password if it’s new or modified
  // if (!user.isModified("password")) return next();

  try {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
    );
    next();
  } catch (err) {
    next(err as Error);
  }
});

// post save middleware
userSchema.post('save', async function (doc, next) {
  doc.password = ''; // hide hashed password
  next();
});

export const User = model<IUser, UserModel>('User', userSchema);
