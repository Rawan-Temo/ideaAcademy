import express from "express";
import userRouter from "../modules/users/user.routes";
const router = express.Router();

router.use("/Users/", userRouter);

export default router;
