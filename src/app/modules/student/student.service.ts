import mongoose from 'mongoose';
import { StudentModel } from './student.model.js';
import AppError from '../../errors/AppError.js';
import httpStatus from 'http-status';
import { User } from '../user/user.model.js';
import { TStudent } from './student.interface.js';
import QueryBuilder from '../../builder/QueryBuilder.js';
import { studentSearchableFields } from './student.constant.js';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(
    StudentModel.find()
      .populate('user')
      .populate('admissionSemester')
      .populate('admissionSemester')
      .populate('academicDepartment academicFaculty'),
    query
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await studentQuery.modelQuery;
  const meta = await studentQuery.countTotal();
  return { meta, result };
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await StudentModel.findById(id)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deleteStudent = await StudentModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deleteStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    const deletedUser = await User.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete');
    }
    await session.commitTransaction();
    await session.endSession();
    return deleteStudent;
  } catch (error) {
    console.log('got an error', error);
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to delete Student');
  }
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdateData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdateData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdateData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdateData[`localGuardian.${key}`] = value;
    }
  }

  const result = await StudentModel.findByIdAndUpdate(id, modifiedUpdateData, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
