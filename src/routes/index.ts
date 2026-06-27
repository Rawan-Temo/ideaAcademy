import express from "express";
import userRouter from "../modules/users/user.routes";
import postRouter from "../modules/posts/post.routes";
import courseRouter from "../modules/courses/course.routes";
const router = express.Router();

router.use("/users", userRouter);
router.use("/courses", courseRouter);
router.use("/posts", postRouter);

export default router;
