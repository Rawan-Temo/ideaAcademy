"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validate_1 = require("../../common/middlewares/validate");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
// Define user-related routes here
router.route("/").get(user_controller_1.getAllUsers).post((0, validate_1.validate)(user_validation_1.createUserSchema), user_controller_1.createUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map