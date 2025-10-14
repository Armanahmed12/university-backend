import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder.js';
import { CourseSearchableFields } from './course.constant.js';
import {
  TCourse,
  TCourseFaculty,
  TPreRequisiteCourses,
} from './course.interface.js';
import { Course, CourseFaulty } from './course.model.js';
import AppError from '../../errors/AppError.js';
import httpStatus from 'http-status';

const createCourseIntoDB = async (course: TCourse) => {
  const result = await Course.create(course);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.modelQuery;
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course'
  );
  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemaingData } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // step1 : Basic course update
    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemaingData,
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    if (!updatedBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
    }

    // check if there is any pre requisite courses to update
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // Filter out the course IDs whose corresponding prerequisite documents should be deleted from the database
      const deletedPreRequisiteCourseIds = preRequisiteCourses
        .filter(
          (eachCourse: TPreRequisiteCourses) =>
            eachCourse.course && eachCourse.isDeleted
        )
        .map((el: TPreRequisiteCourses) => el.course);

      const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: {
              course: { $in: deletedPreRequisiteCourseIds },
            },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );

      if (!deletedPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
      }

      // Filter out the prerequisite courses that need to be added (i.e. not marked for deletion)
      const preRequisiteCoursesToAdd = preRequisiteCourses?.filter(
        (preRequisiteCourse: TPreRequisiteCourses) =>
          preRequisiteCourse.course && !preRequisiteCourse.isDeleted
      );

      // Add the new prerequisite courses to the existing course document
      const updatedCourseWithNewPreRequisites = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            preRequisiteCourses: { $each: preRequisiteCoursesToAdd },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );

      if (!updatedCourseWithNewPreRequisites) {
        throw new AppError(httpStatus.BAD_REQUEST, 'failed to update course');
      }
    }

    await session.commitTransaction();
    await session.endSession();

    const result = await Course.findById(id).populate(
      'preRequisiteCourses.course'
    );
    return result;
  } catch (error) {
    console.log(error, 'error from the updateCourseIntoDB');
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'failed to update course');
  }
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    }
  );
  return result;
};

const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>
) => {
  const result = await CourseFaulty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true,
      new: true,
    }
  );

  return result;
};

const removeFacultiesFromCourseFromDB = async (
  id: string,
  payload: Partial<TCourseFaculty>
) => {
  const result = await CourseFaulty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    {
      new: true,
    }
  );
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  removeFacultiesFromCourseFromDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  assignFacultiesWithCourseIntoDB,
  updateCourseIntoDB,
};
