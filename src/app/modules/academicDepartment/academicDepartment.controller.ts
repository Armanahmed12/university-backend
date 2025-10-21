import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import { AcademicDepartmentServices } from './academicDepartment.services.js';
import sendResponse from '../../utils/sendResponse.js';

const createAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic department is created successfully',
    data: result,
  });
});

const getAllAcademicDepartments = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic departments are retrieved successfully',
    meta: result.meta,
    data: result,
  });
});

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result =
    await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(
      departmentId as string
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic department is retrieved successfully',
    data: result,
  });
});

const updateAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result =
    await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(
      departmentId as string,
      req.body
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic department is updated successfully',
    data: result,
  });
});

export const AcademicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
};
