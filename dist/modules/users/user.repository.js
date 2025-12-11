"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const apiFeatures_1 = require("../../common/utils/apiFeatures");
const client_1 = require("../../prisma/client");
exports.userRepository = {
    getAll: async (query) => {
        const features = new apiFeatures_1.PrismaAPIFeatures("user", query, {
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
    create: (data) => client_1.prisma.user.create({
        data,
    }),
};
//# sourceMappingURL=user.repository.js.map