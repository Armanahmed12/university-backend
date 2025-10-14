import { academicSemesterNameCodeMapper } from './academicSemester.constant.js';
import { TAcademicSemester } from './academicSemester.interface.js';
import { AcademicSemester } from './academicSemester.model.js';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester code');
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

// get all data from db
const getAllAcademicSemestersFromDB = async () => {
  const result = await AcademicSemester.find();
  return result;
};
// get a Single AcademicSemester
const getSingleAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemester.findById(id);
  return result;
};

// update academicSemester into db
const updateAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>
) => {
  if (
    payload.code &&
    payload.name &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error('Invalid Semester Code!');
  }
  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  updateAcademicSemesterIntoDB,
  getSingleAcademicSemesterFromDB,
};
