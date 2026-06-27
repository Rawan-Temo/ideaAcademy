import express from "express";
import {
  createCourse,
  deleteCourse,
  getALlCourses,
  getOneCourse,
  updateCourse,
} from "./course.controller";
import { authenticateToken } from "../../common/middlewares/authMiddleware";
import { validateBody, validateQuery } from "../../common/middlewares/validate";
import { CourseQueryDTO } from "./course.types";
import { uploadMedia } from "../../common/middlewares/multerConfig";
import { createCourseSchema, updateCourseSchema } from "./course.validation";
const courseFields = [
  "title",
  "id",
  "content",
  "image",
  "createdAt",
  "updatedAt",
];
const router = express.Router();

router
  .route("/")
  .get(validateQuery<CourseQueryDTO>(courseFields), getALlCourses)
  .post(
    authenticateToken,
    uploadMedia,
    validateBody(createCourseSchema),
    createCourse,
  );
router
  .route("/:id")
  .get(getOneCourse)
  .patch(
    authenticateToken,
    uploadMedia,
    validateBody(updateCourseSchema),
    updateCourse,
  )
  .delete(authenticateToken, deleteCourse);

export default router;
