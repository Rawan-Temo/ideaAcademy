import express from "express";
import { getAllUsers, createUser } from "./user.controller";
import { validate } from "../../common/middlewares/validate";
import { createUserSchema } from "./user.validation";

const router = express.Router();
// Define user-related routes here
router.route("/").get(getAllUsers).post(validate(createUserSchema), createUser);
export default router;
