import { Request } from "express";
import { PrismaAPIFeatures } from "../../common/utils/apiFeatures";
import { User } from "../../generated/prisma/client";
import {
  UserFindManyArgs,
  UserWhereInput,
} from "../../generated/prisma/models";
import { prisma } from "../../prisma/client";
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserQueryDto,
  UserResponse,
} from "./user.types";

export const userRepository = {
  getAll: async (query: UserQueryDto) => {
    const features = new PrismaAPIFeatures("user", query, {
      omit: { password: true },
    })
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const rows = await features.findMany();

    const count = await features.count();

    return { rows, count };
  },
  create: (data: CreateUserDTO) =>
    prisma.user.create({
      data,
    }),
  getById: (id: any) =>
    prisma.user.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    }),
  update: (data: UpdateUserDTO, id: any) =>
    prisma.user.update({
      where: {
        id,
      },
      data,
    }),
  deleteMany: (ids: any[]) =>
    prisma.user.deleteMany({
      where: {
        id: { in: ids },
      },
    }),
  findByUsername: (username: string) =>
    prisma.user.findUnique({
      where: {
        username,
      },
      omit: {
        password: true,
      },
    }),
};
