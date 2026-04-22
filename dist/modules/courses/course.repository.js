"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRepository = void 0;
const apiFeatures_1 = require("../../common/utils/apiFeatures");
const client_1 = require("../../prisma/client");
exports.courseRepository = {
    getAll: async (query) => {
        const features = new apiFeatures_1.PrismaAPIFeatures("course", query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const rows = await features.findMany();
        const count = await features.count();
        return { rows, count };
    },
    create: (data) => client_1.prisma.course.create({
        data,
    }),
    getById: (id) => client_1.prisma.course.findUnique({
        where: {
            id,
        },
    }),
    update: (data, id) => client_1.prisma.course.update({
        where: {
            id,
        },
        data,
    }),
    delete: (id) => client_1.prisma.course.delete({
        where: {
            id,
        },
    }),
    deleteMany: (ids) => client_1.prisma.course.deleteMany({
        where: {
            id: { in: ids },
        },
    }),
};
//# sourceMappingURL=course.repository.js.map