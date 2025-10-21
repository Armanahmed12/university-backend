/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Types } from 'mongoose';
import { config } from '../../config/index.js';
import { TStudent } from '../student/student.interface.js';
import { IUser } from './user.interface.js';
import { User } from './user.model.js';
import { StudentModel } from '../student/student.model.js';
import { AcademicSemester } from '../academicSemester/academicSemester.model.js';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils.js';
import AppError from '../../errors/AppError.js';
import httpStatus from 'http-status';
import { Admin } from '../admin/admin.model.js';
import { TFaculty } from '../faculty/faculty.interface.js';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model.js';
import { Faculty } from '../faculty/faculty.model.js';
import { TAdmin } from '../admin/admin.interface.js';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary.js';

const createStudentIntoDB = async (
  file: any,
  password: string,
  payload: TStudent
) => {
  const userData: Partial<IUser> = {};
  userData.password = password || (config.default_password as string);
  userData.role = 'student';
  userData.email = payload?.email;
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester
  );

  if (!admissionSemester) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No AcademicSemester found for the given admissionSemester ID!'
    );
  }
  // find department
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment
  );
  if (!academicDepartment) {
    throw new AppError(400, 'Acamic department not found');
  }
  payload.academicFaculty = academicDepartment.academicFaculty;
  userData.id = await generateStudentId(admissionSemester);

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (file) {
      const imageName = `${userData?.id}${payload?.name.firstName}`;
      const path = file?.path;
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    // Step 1️⃣ Create User
    const newUser = await User.create([userData], { session });

    if (!newUser[0]) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // Step 2️⃣ Create Student
    payload.id = newUser[0].id;
    payload.user = new Types.ObjectId(newUser[0]._id);

    const newStudent = await StudentModel.create([payload], { session });
    if (!newStudent[0]) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }
    // Step 3️⃣ Commit transaction
    await session.commitTransaction();
    console.log('✅ Transaction successful!');
    return newStudent[0];
  } catch (error) {
    await session.abortTransaction();
    console.error('❌ Transaction failed! Rolling back...', error);
    throw error;
  } finally {
    session.endSession();
  }
};

const createFacultyIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty
) => {
  // create a user object
  const userData: Partial<IUser> = {};
  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'faculty';
  userData.email = payload?.email;
  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }
  payload.academicFaculty = academicDepartment.academicFaculty;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (file) {
      const imageName = `${userData?.id}${payload?.name.firstName}`;
      const path = file?.path;
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    //set  generated id
    userData.id = await generateFacultyId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a faculty
    if (!newUser[0]) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = new Types.ObjectId(newUser[0]._id); //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty[0]) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }
    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TAdmin
) => {
  // create a user object
  const userData: Partial<IUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'admin';
  userData.email = payload?.email;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    if (file) {
      const imageName = `${userData?.id}${payload?.name.firstName}`;
      const path = file?.path;
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }
    //set  generated id
    userData.id = await generateAdminId();
    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser[0]) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = new Types.ObjectId(newUser[0]._id); //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin[0]) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

// get your profile from db
const getMe = async (userId: string, role: string) => {
  let result = null;
  if (role === 'student') {
    result = await StudentModel.findOne({ id: userId }).populate('user');
  } else if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  } else {
    result = await Faculty.findOne({ id: userId }).populate('user');
  }

  return result;
};

// change status
const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus,
};
