import { PrismaAPIFeatures } from "../../common/utils/apiFeatures";
import { prisma } from "../../prisma/client";
import { CreateUserDTO } from "./user.types";

export const userRepository = {
  getAll: async (query: any) => {
    const features = new PrismaAPIFeatures(prisma.user, query)
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
};
