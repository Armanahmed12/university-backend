import mongoose, { Query, Schema } from 'mongoose';
import {
  Guardian,
  LocalGuardian,
  IStudentModel,
  UserName,
  TStudent,
} from './student.interface.js';
import AppError from '../../errors/AppError.js';
import httpStatus from 'http-status';

const userNameSchema = new Schema<UserName>({
  firstName: {
    type: String,
    required: [true, 'FirstName must be given!'],
    trim: true,
    maxLength: 20,
    validate: {
      validator: function (value: string) {
        const properNameStyle = value.charAt(0).toUpperCase() + value.slice(1);
        return properNameStyle === value;
      },
      message: `{VALUE} is not capitalized format!`,
    },
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const guardianSchema = new Schema<Guardian>({
  fatherName: {
    type: String,
    required: true,
  },
  fatherOccupation: {
    type: String,
    required: true,
  },
  fatherContactNo: {
    type: String,
    required: true,
  },
  motherName: {
    type: String,
    required: true,
  },
  motherOccupation: {
    type: String,
    required: true,
  },
  motherContactNo: {
    type: String,
    required: true,
  },
});

const localGuardianSchema = new Schema<LocalGuardian>({
  name: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const studentSchema = new Schema<TStudent>(
  {
    id: { type: String, required: [true, 'ID is required'], unique: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
    name: {
      type: userNameSchema,
      required: true,
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message:
          "The value `{VALUE}` must be one of the following: 'male', 'female' or 'other'",
      },
      required: true,
    },
    dateOfBirth: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: { type: guardianSchema, required: true },
    localGuardian: { type: localGuardianSchema, required: true },
    profileImg: { type: String, default: '' },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },
    isDeleted: { type: Boolean, default: false },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    // methods: {
    //   async checkExists(): Promise<boolean> {
    //     const doc = await StudentModel.exists({ id: this.id });
    //     return !!doc;
    //   },
    // },
    statics: {
      async doesUserExist(id: string) {
        return await this.exists({ id }); // ✅ "this" refers to the model
      },
    },
  }
);

studentSchema.virtual('fullName').get(function () {
  const name = this.name as UserName;

  // Build fullname with optional middleName
  return [name?.firstName, name?.middleName, name?.lastName]
    .filter(Boolean) // removes undefined / empty
    .join(' ');
});

// query middleware
studentSchema.pre(/^find/, function (this: Query<TStudent[], TStudent>, next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// 🧩 Pre hook for update to check if user exists
studentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const existingUser = await StudentModel.findById(query);
  if (!existingUser) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No user found with the provided id to update'
    );
  }
  next();
});

export const StudentModel = mongoose.model<TStudent, IStudentModel>(
  'Student',
  studentSchema
);
