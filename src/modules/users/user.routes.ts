import express from "express";
import {
  getAllUsers,
  createUser,
  getOnUser,
  updateUser,
  deleteManyUsers,
} from "./user.controller";
import { validate } from "../../common/middlewares/validate";
import { createUserSchema } from "./user.validation";

const router = express.Router();
// Define user-related routes here
router.route("/").get(getAllUsers).post(validate(createUserSchema), createUser);
router.route("/delete-many").delete(deleteManyUsers)
router.route("/:id").get(getOnUser).patch(updateUser);

export default router;
