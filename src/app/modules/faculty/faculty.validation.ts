import { z } from 'zod';
import { BloodGroup, Gender } from './faculty.constant.js';

const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First Name is required' })
    .max(20, { message: 'First Name cannot be more than 20 characters' })
    .refine((value) => /^[A-Z]/.test(value), {
      message: 'First Name must start with a capital letter',
    }),
  middleName: z.string(),
  lastName: z.string().min(1, { message: 'Last Name is required' }),
});

// Helper for enum type assertion, making the enum usage cleaner
const GenderEnum = z.enum(Gender as [string, ...string[]]);
const BloodGroupEnum = z.enum(BloodGroup as [string, ...string[]]);

export const createFacultyValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .max(20, { message: 'Password cannot be more than 20 characters' }),

    faculty: z.object({
      designation: z.string().min(1, { message: 'Designation is required' }),
      name: userNameValidationSchema,
      gender: GenderEnum,
      dateOfBirth: z.string().optional(),
      email: z.email({ message: 'Invalid email address' }),
      contactNo: z.string().min(1, { message: 'Contact Number is required' }),
      emergencyContactNo: z
        .string()
        .min(1, { message: 'Emergency Contact Number is required' }),
      bloodGroup: BloodGroupEnum,
      presentAddress: z
        .string()
        .min(1, { message: 'Present Address is required' }),
      permanentAddress: z
        .string()
        .min(1, { message: 'Permanent Address is required' }),
      academicDepartment: z
        .string()
        .min(1, { message: 'Academic Department is required' }),
      profileImg: z
        .string()
        .url({ message: 'Must be a valid URL for profile image' })
        .optional(),
    }),
  }),
});

// Update Faculty Validation Schemas

// Separate schema for updating the name, making all fields optional
const updateUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First Name cannot be empty' })
    .max(20, { message: 'First Name cannot be more than 20 characters' })
    .refine((value) => /^[A-Z]/.test(value), {
      message: 'First Name must start with a capital letter',
    })
    .optional(),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(1, { message: 'Last Name cannot be empty' })
    .optional(),
});

export const updateFacultyValidationSchema = z.object({
  body: z.object({
    faculty: z.object({
      designation: z.string().optional(),
      name: updateUserNameValidationSchema.optional(), // Name object itself is optional
      gender: GenderEnum.optional(),
      dateOfBirth: z.string().optional(),
      email: z.email({ message: 'Invalid email address' }).optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: BloodGroupEnum.optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      profileImg: z.url({ message: 'Must be a valid URL' }).optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
});

// Export All Validations
export const facultyValidations = {
  createFacultyValidationSchema,
  updateFacultyValidationSchema,
};
