import express from "express";
import {
  getAllUsers,
  createUser,
  getOnUser,
  updateUser,
  deleteManyUsers,
  login,
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

router.route("/login").post(login);
router.route("/delete-many").delete(deleteManyUsers);

// T extends the post function itself u can set the request body
router.route("/:id").get(getOnUser).patch(updateUser);

export default router;
