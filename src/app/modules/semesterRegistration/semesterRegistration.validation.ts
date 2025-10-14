import { z } from 'zod';
import { SemesterRegistrationStatus } from './semesterRegistration.constant.js';

const createSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string(),
    status: z.enum([...(SemesterRegistrationStatus as [string, ...string[]])]),
    startDate: z.iso.datetime(),
    endDate: z.iso.datetime(),
    minCredit: z.number(),
    maxCredit: z.number(),
  }),
});

const upadateSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string().optional(),
    status: z
      .enum([...(SemesterRegistrationStatus as [string, ...string[]])])
      .optional(),
    startDate: z.iso.datetime().optional(),
    endDate: z.iso.datetime().optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
  }),
});

export const SemesterRegistrationValidations = {
  createSemesterRegistrationValidationSchema,
  upadateSemesterRegistrationValidationSchema,
};
