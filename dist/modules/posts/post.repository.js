"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRepository = void 0;
const apiFeatures_1 = require("../../common/utils/apiFeatures");
const client_1 = require("../../prisma/client");
exports.postRepository = {
    getAll: async (query) => {
        const features = new apiFeatures_1.PrismaAPIFeatures("post", query, {})
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const rows = await features.findMany();
        const count = await features.count();
        return { rows, count };
    },
    create: (data) => client_1.prisma.post.create({
        data,
    }),
    getById: (id) => client_1.prisma.post.findUnique({
        where: {
            id,
        },
    }),
    update: (data, id) => client_1.prisma.post.update({
        where: {
            id,
        },
        data,
    }),
    deleteMany: (ids) => client_1.prisma.post.deleteMany({
        where: {
            id: { in: ids },
        },
    }),
};
//# sourceMappingURL=post.repository.js.map