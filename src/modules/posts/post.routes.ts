import express from "express";
import {
  getAllPosts,
  createPost,
  getOnPost,
  updatePost,
  deleteManyPosts,
} from "./post.controller";
import { validateBody, validateQuery } from "../../common/middlewares/validate";
import { createPostSchema, updatePostSchema } from "./post.validation";
import { PostQueryDto } from "./post.types";
const postFields = [
  "title",
  "id",
  "content",
  "image",
  "createdAt",
  "updatedAt",
];
const router = express.Router();
// Define user-related routes here
router
  .route("/")
  .get(validateQuery<PostQueryDto>(postFields), getAllPosts)
  .post(validateBody(createPostSchema), createPost);

router.route("/delete-many").delete(deleteManyPosts);

// T extends the post function itself u can set the request body
router
  .route("/:id")
  .get(getOnPost)
  .patch(validateBody(updatePostSchema), updatePost);

export default router;
