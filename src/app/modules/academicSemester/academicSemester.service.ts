import QueryBuilder from '../../builder/QueryBuilder.js';
import {
  academicSemesterNameCodeMapper,
  AcademicSemesterSearchableFields,
} from './academicSemester.constant.js';
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
const getAllAcademicSemestersFromDB = async (
  query: Record<string, unknown>
) => {
  const academicSemesterQuery = new QueryBuilder(AcademicSemester.find(), query)
    .search(AcademicSemesterSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await academicSemesterQuery.modelQuery;
  const meta = await academicSemesterQuery.countTotal();

  return {
    meta,
    result,
  };
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
