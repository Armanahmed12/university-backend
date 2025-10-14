import z from 'zod';
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from './academicSemester.constant.js';

const createAcademicSemesterValidation = z.object({
  body: z.object({
    name: z.enum([...AcademicSemesterName]),
    year: z.string(),
    code: z.enum([...AcademicSemesterCode]),
    startMonth: z.enum([...Months]),
    endMonth: z.enum([...Months]),
  }),
});

const updateAcademicSemesterValidation = z.object({
  body: z.object({
    name: z.enum([...AcademicSemesterName]).optional(),
    year: z.string().optional(),
    code: z.enum([...AcademicSemesterCode]).optional(),
    startMonth: z.enum([...Months]).optional(),
    endMonth: z.enum([...Months]).optional(),
  }),
});

export const academicSemesterValidations = {
  createAcademicSemesterValidation,
  updateAcademicSemesterValidation,
};
