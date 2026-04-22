"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourseSchema = exports.createCourseSchema = void 0;
const zod_1 = require("zod");
exports.createCourseSchema = zod_1.z
    .object({
    title: zod_1.z.string().min(1).max(255),
    image: zod_1.z.string().url(),
    content: zod_1.z.string().min(1),
})
    .strict();
exports.updateCourseSchema = zod_1.z
    .object({
    title: zod_1.z.string().min(1).max(255).optional(),
    image: zod_1.z.string().url().optional(),
    content: zod_1.z.string().min(1).optional(),
})
    .strict();
//# sourceMappingURL=course.validation.js.map