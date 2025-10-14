import { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface.js';
import AppError from '../../errors/AppError.js';
import httpStatus from 'http-status';

const academicDepartmentSchema = new Schema<TAcademicDepartment>({
  name: { type: String, required: true, unique: true },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicFaculty',
  },
});

academicDepartmentSchema.pre('save', async function (next) {
  const doesDepartmentExist = await AcademicDepartment.findOne({
    name: this.name,
  });

  if (doesDepartmentExist) {
    throw new AppError(httpStatus.CONFLICT, 'This department already exists');
  }

  next();
});

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const doesDepartmentExist = await AcademicDepartment.findOne(query);

  if (!doesDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, "The Department doesn't exist!");
  }

  next();
});

export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema
);
