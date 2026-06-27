import { Course } from "../../generated/prisma/client";
import { deleteCourse } from "./course.controller";
import { courseRepository } from "./course.repository";
import {
  CourseQueryDTO,
  CreateCourseDTO,
  UpdateCourseDTO,
} from "./course.types";

export const courseService = {
  getALlCourses: async (query: CourseQueryDTO) => {
    return courseRepository.getAll(query);
  },
  createCourse: async (data: CreateCourseDTO) => {
    return courseRepository.create(data);
  },
  getCourseById: async (id: string) => {
    return courseRepository.getById(id);
  },
  updateCourse: async (data: UpdateCourseDTO, id: string) => {
    return courseRepository.update(data, id);
  },
  deleteCourse: async (id: string) => {
    return courseRepository.deleteOne(id);
  },
};
