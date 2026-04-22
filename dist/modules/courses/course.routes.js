"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("./course.controller");
const validate_1 = require("../../common/middlewares/validate");
const course_validation_1 = require("./course.validation");
const courseFields = ["title", "image", "content", "id", "createdAt", "updatedAt"];
const router = express_1.default.Router();
router
    .route("/")
    .get((0, validate_1.validateQuery)(courseFields), course_controller_1.getAllCourses)
    .post((0, validate_1.validateBody)(course_validation_1.createCourseSchema), course_controller_1.createCourse);
router.route("/delete-many").delete(course_controller_1.deleteManyCourses);
router
    .route("/:id")
    .get(course_controller_1.getOneCourse)
    .patch((0, validate_1.validateBody)(course_validation_1.updateCourseSchema), course_controller_1.updateCourse)
    .delete(course_controller_1.deleteCourse);
exports.default = router;
//# sourceMappingURL=course.routes.js.map