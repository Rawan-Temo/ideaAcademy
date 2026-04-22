"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = zod_1.z
    .object({
    title: zod_1.z.string().min(3).max(100),
    image: zod_1.z.string().optional(),
    content: zod_1.z.string().min(10).max(1000).optional(),
})
    .strict();
exports.updatePostSchema = zod_1.z
    .object({
    title: zod_1.z.string().min(3).max(100).optional(),
    image: zod_1.z.string().optional(),
    content: zod_1.z.string().min(10).max(1000).optional(),
})
    .strict();
//# sourceMappingURL=post.validation.js.map