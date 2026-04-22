"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z
    .object({
    username: zod_1.z.string().min(3).max(30),
    password: zod_1.z.string().min(6),
})
    .strict();
exports.updateUserSchema = zod_1.z
    .object({
    username: zod_1.z.string().min(3).max(30).optional(),
    password: zod_1.z.string().min(6).optional(),
    refreshToken: zod_1.z.string().optional(),
})
    .strict();
//# sourceMappingURL=user.validation.js.map