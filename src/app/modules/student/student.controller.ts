import { StudentServices } from './student.service.js';
import sendResponse from '../../utils/sendResponse.js';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';

const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.getSingleStudentFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is retrieved successfully',
    data: result,
  });
});

// get all students data
const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students are retrieved successfully',
    meta: result.meta,
    data: result,
  });
});

// update student
const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.updateStudentIntoDB(
    id as string,
    req.body.student
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'The student has been updated successfully',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.deleteStudentFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is deleted successfully',
    data: result,
  });
});

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateStudent,
};
