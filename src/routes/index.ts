import express from "express";
import userRouter from "../modules/users/user.routes";
import postRouter from "../modules/posts/post.routes"
const router = express.Router();

router.use("/Users/", userRouter);
router.use("/Posts" , postRouter)

export default router;
