import express from "express";
import {
  getAllPosts,
  createPost,
  getOnPost,
  updatePost,
  deletePost,
} from "./post.controller";
import { validateBody, validateQuery } from "../../common/middlewares/validate";
import { createPostSchema, updatePostSchema } from "./post.validation";
import { PostQueryDto } from "./post.types";
import { authenticateToken } from "../../common/middlewares/authMiddleware";
import {
  uploadImage,
  uploadMedia,
} from "../../common/middlewares/multerConfig";
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
  .post(
    authenticateToken,
    uploadMedia,
    validateBody(createPostSchema),
    createPost,
  );

// T extends the post function itself u can set the request body
router
  .route("/:id")
  .get(getOnPost)
  .patch(
    authenticateToken,
    uploadMedia,
    validateBody(updatePostSchema),
    updatePost,
  )
  .delete(authenticateToken, deletePost);

export default router;
