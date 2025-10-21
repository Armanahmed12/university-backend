import { z } from 'zod';

// student create schemas started from here
const userNameSchema = z.object({
  firstName: z
    .string()
    .min(1)
    .max(20)
    .refine((value) => /^[A-Z]/.test(value), {
      message: 'First Name must start with a capital letter',
    }),
  middleName: z.string(),
  lastName: z.string(),
});

const guardianSchema = z.object({
  fatherName: z.string(),
  fatherOccupation: z.string(),
  fatherContactNo: z.string(),
  motherName: z.string(),
  motherOccupation: z.string(),
  motherContactNo: z.string(),
});

const localGuardianSchema = z.object({
  name: z.string(),
  occupation: z.string(),
  contactNo: z.string(),
  address: z.string(),
});

export const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    student: z.object({
      name: userNameSchema,
      gender: z.enum(['male', 'female', 'other']),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      guardian: guardianSchema,
      localGuardian: localGuardianSchema,
      admissionSemester: z.string(),
      academicDepartment: z.string(),
    }),
  }),
});

// -------------- Studnet create related schemas ended here & Update related schemas' started from here ---------- //

const updateUserNameSchema = z
  .object({
    firstName: z
      .string()
      .min(1)
      .max(20)
      .refine((value) => /^[A-Z]/.test(value), {
        message: 'First Name must start with a capital letter',
      }),
    middleName: z.string(),
    lastName: z.string(),
  })
  .partial(); // all fields optional

// Guardian schema for updating student
const updateGuardianSchema = z
  .object({
    fatherName: z.string(),
    fatherOccupation: z.string(),
    fatherContactNo: z.string(),
    motherName: z.string(),
    motherOccupation: z.string(),
    motherContactNo: z.string(),
  })
  .partial();

// Local guardian schema for updating student
const updateLocalGuardianSchema = z
  .object({
    name: z.string(),
    occupation: z.string(),
    contactNo: z.string(),
    address: z.string(),
  })
  .partial();

// Main update student validation schema
export const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z
      .object({
        name: updateUserNameSchema.optional(),
        gender: z.enum(['male', 'female', 'other']).optional(),
        dateOfBirth: z.string().optional(),
        email: z.string().email().optional(),
        contactNo: z.string().optional(),
        emergencyContactNo: z.string().optional(),
        bloodGroup: z
          .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
          .optional(),
        presentAddress: z.string().optional(),
        permanentAddress: z.string().optional(),
        guardian: updateGuardianSchema.optional(),
        localGuardian: updateLocalGuardianSchema.optional(),
        admissionSemester: z.string().optional(),
        academicDepartment: z.string().optional(),
        profileImg: z.string().optional(),
      })
      .partial(),
  }),
});
// --------------- Finished update Validation schema------------ //

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
