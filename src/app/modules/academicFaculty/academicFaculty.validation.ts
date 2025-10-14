/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';

// 🔹 Helper to handle type + required errors
const stringError = (field: string) => (issue: any) => {
  if (issue.code === 'invalid_type') {
    return { message: `${field} must be a string` };
  }
  return { message: `${field} is required` };
};

// 🔹 Create Faculty Schema
const createAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ error: stringError('Academic faculty') })
      .min(1, { message: 'Name cannot be empty' }),
  }),
});

// 🔹 Update Faculty Schema
const updateAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ error: stringError('Academic faculty') })
      .min(1, { message: 'Name cannot be empty' })
      .optional(),
  }),
});

// 🔹 Export
export const AcademicFacultyValidations = {
  createAcademicFacultyValidationSchema,
  updateAcademicFacultyValidationSchema,
};
