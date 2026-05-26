import { Request } from "express";
import { PrismaAPIFeatures } from "../../common/utils/apiFeatures";
import { Post } from "../../generated/prisma/client";
import {
  PostFindManyArgs,
  PostWhereInput,
} from "../../generated/prisma/models";
import { prisma } from "../../prisma/client";
import {
  CreatePostDTO,
  UpdatePostDTO,
  PostQueryDto,
  PostResponse,
} from "./post.types";

export const postRepository = {
  getAll: async (query: PostQueryDto) => {
    const features = new PrismaAPIFeatures("post", query, {})
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const rows = await features.findMany();

    const count = await features.count();

    return { rows, count };
  },
  create: (data: CreatePostDTO) =>
    prisma.post.create({
      data,
    }),

  getById: (id: any) =>
    prisma.post.findUnique({
      where: {
        id,
      },
    }),
  update: (data: UpdatePostDTO, id: any) =>
    prisma.post.update({
      where: {
        id,
      },
      data,
    }),
  deleteMany: (ids: any[]) =>
    prisma.post.deleteMany({
      where: {
        id: { in: ids },
      },
    }),
  deleteOne: (id: string) =>
    prisma.post.delete({
      where: {
        id,
      },
    }),
};
