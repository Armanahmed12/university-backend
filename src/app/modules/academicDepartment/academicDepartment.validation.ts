/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';

// 🔹 Helper function to reduce repetition
const stringError = (field: string) => (issue: any) => {
  if (issue.code === 'invalid_type') {
    return { message: `${field} must be a string` };
  }
  return { message: `${field} is required` };
};

// 🔹 Create validation schema
const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ error: stringError("Academic department's name") })
      .min(1, { message: 'Name cannot be empty' }),

    academicFaculty: z
      .string({ error: stringError('Academic faculty') })
      .min(1, { message: 'Faculty cannot be empty' }),
  }),
});

// 🔹 Update validation schema
const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ error: stringError("Academic department's name") })
      .min(1, { message: 'Name cannot be empty' })
      .optional(),

    academicFaculty: z
      .string({ error: stringError('Academic faculty') })
      .min(1, { message: 'Faculty cannot be empty' })
      .optional(),
  }),
});

// 🔹 Export
export const AcademicDepartmentValidations = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
