import { PrismaAPIFeatures } from "../../common/utils/apiFeatures";
import { prisma } from "../../prisma/client";
import {
  CourseQueryDTO,
  CreateCourseDTO,
  UpdateCourseDTO,
} from "./course.types";

export const courseRepository = {
  getAll: async (query: CourseQueryDTO) => {
    const features = new PrismaAPIFeatures("course", query, {})
      .filter()
      .sort()
      .limitFields()
      .paginate();
    prisma.course.findMany({
      where: {
        id: {
          notIn: ["test"],
        },
      },
    });

    const rows = await features.findMany();

    const count = await features.count();

    return { rows, count };
  },
  create: async (data: CreateCourseDTO) => {
    return prisma.course.create({
      data,
    });
  },
  getById: async (id: string) => {
    return prisma.course.findUnique({
      where: {
        id,
      },
    });
  },
  update: async (data: UpdateCourseDTO, id: string) => {
    return prisma.course.update({
      where: {
        id,
      },
      data,
    });
  },
  deleteOne: async (id: string) => {
    return prisma.course.delete({
      where: {
        id,
      },
    });
  },
};
