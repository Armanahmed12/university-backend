import { model, Schema } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface.js';
import { AcademicSemesterCode, Months } from './academicSemester.constant.js';

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: { type: String, required: true },
    year: { type: String, required: true },
    code: { type: String, enum: AcademicSemesterCode, required: true },
    startMonth: { type: String, enum: Months, required: true },
    endMonth: { type: String, enum: Months, required: true },
  },
  {
    timestamps: true,
  }
);

academicSemesterSchema.pre('save', async function (next) {
  const doesUserExist = await AcademicSemester.findOne({
    name: this.name,
    year: this.year,
  });

  if (doesUserExist) {
    throw new Error('Semester already exists !');
  }
  next();
});

export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema
);
