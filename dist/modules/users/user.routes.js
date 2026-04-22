"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validate_1 = require("../../common/middlewares/validate");
const user_validation_1 = require("./user.validation");
const authMiddleware_1 = require("../../common/middlewares/authMiddleware");
const userFields = ["username", "id", "createdAt", "updatedAt"];
const router = express_1.default.Router();
// Define user-related routes here
router
    .route("/")
    .all(authMiddleware_1.authenticateToken)
    .get((0, validate_1.validateQuery)(userFields), user_controller_1.getAllUsers)
    .post((0, validate_1.validateBody)(user_validation_1.createUserSchema), user_controller_1.createUser);
router.route("/login").post(user_controller_1.login);
router.route("/delete-many").delete(authMiddleware_1.authenticateToken, user_controller_1.deleteManyUsers);
// T extends the post function itself u can set the request body
router
    .route("/:id")
    .all(authMiddleware_1.authenticateToken)
    .get(user_controller_1.getOnUser)
    .patch((0, validate_1.validateBody)(user_validation_1.updateUserSchema), user_controller_1.updateUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map