import express from "express";
import {
  getAllUsers,
  createUser,
  getOnUser,
  updateUser,
  deleteManyUsers,
} from "./user.controller";
import { validate, validateQuery } from "../../common/middlewares/validate";
import { createUserSchema } from "./user.validation";
import { UserQueryDto } from "./user.types";
const userFields = ["username", "id", "createdAt", "updatedAt"];
const router = express.Router();
// Define user-related routes here
router
  .route("/")
  .get(validateQuery<UserQueryDto>(userFields), getAllUsers)
  .post(validate(createUserSchema), createUser);
router.route("/delete-many").delete(deleteManyUsers);
router.route("/:id").get(getOnUser).patch(updateUser);

export default router;
