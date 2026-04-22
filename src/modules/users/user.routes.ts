import express from "express";
import {
  getAllUsers,
  createUser,
  getOneUser,
  updateUser,
  deleteManyUsers,
  login,
  logout,
  refreshToken,
} from "./user.controller";
import { validateBody, validateQuery } from "../../common/middlewares/validate";
import { createUserSchema, updateUserSchema } from "./user.validation";
import { UserQueryDto } from "./user.types";
import { authenticateToken } from "../../common/middlewares/authMiddleware";
const userFields = ["username", "id", "createdAt", "updatedAt"];
const router = express.Router();
// Define user-related routes here
router
  .route("/")
  .all(authenticateToken)
  .get(validateQuery<UserQueryDto>(userFields), getAllUsers)
  .post(validateBody(createUserSchema), createUser);

router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/refresh-token").post(refreshToken);

router.route("/delete-many").delete(authenticateToken, deleteManyUsers);
// T extends the post function itself u can set the request body
router
  .route("/:id")
  .all(authenticateToken)
  .get(getOneUser)
  .patch(validateBody(updateUserSchema), updateUser);

export default router;
