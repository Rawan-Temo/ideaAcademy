"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(30),
    password: zod_1.z.string().min(6),
});
//# sourceMappingURL=user.validation.js.map