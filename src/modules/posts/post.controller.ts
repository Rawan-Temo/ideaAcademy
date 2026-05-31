import { type Request, type Response } from "express";
import { PostService } from "./post.service";
import { Post } from "../../generated/prisma/browser";
import { GetAllResponse } from "../../common/types/apiResponse";

import { PostQueryDto } from "./post.types";
import { handleError } from "../../common/utils/handleError";
import { deleteFile } from "../../common/middlewares/multerConfig";
import { sendNotFound } from "../../common/utils/response";
// TODO Handle Multer
const getAllPosts = async <T extends PostQueryDto>(
  req: Request<any, any, any, T>,
  res: Response,
) => {
  try {
    const { rows, count } = await PostService.getAllPosts(req.query);

    const response: GetAllResponse<Post> = {
      status: "success",
      data: rows,
      results: rows.length,
      total: count,
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    if (req.files) {
      const files = req.files as MulterFiles;
      const image = files["image"]?.[0];
      image && (req.body.image = `/images/${image.filename}`);
      console.log(files);
      const video = files["video"]?.[0];
      video && (req.body.video = `/videos/${video.filename}`);
    }
    const post = await PostService.createPost({
      title,
      content,
      image: req.body.image,
      video: req.body.video,
    });
    res.status(201).json(post);
  } catch (error) {
    if (req.files) {
      Object.values(req.files).forEach((file: any) => {
        deleteFile(file[0].path);
      });
    }
    console.error(error);
    handleError(error, res);
  }
};

const getOnPost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const post = await PostService.getPostById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const oldPost = await PostService.getPostById(id);
    if (!oldPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    const oldImage = oldPost.image;
    const oldVideo = oldPost.video;
    if (req.files) {
      const files = req.files as MulterFiles;
      const image = files["image"]?.[0];
      image && (req.body.image = `/images/${image.filename}`);
      const video = files["video"]?.[0];
      video && (req.body.video = `/videos/${video.filename}`);
    }
    const data = req.body;
    const post = await PostService.updatePost(data, id);
    if (oldImage && oldImage !== post.image) {
      console.log(oldImage);
      deleteFile(oldImage.slice(1));
    }
    if (oldVideo && oldVideo !== post.video) {
      deleteFile(oldVideo.slice(1));
    }
    res.status(200).json(post);
  } catch (error) {
    if (req.files) {
      Object.values(req.files).forEach((file: any) => {
        deleteFile(file[0].path);
      });
    }
    console.error(error);
    handleError(error, res);
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const post = await PostService.deletePost(id);
    if (!post) {
      sendNotFound(res, "Post not found");
      return;
    }
    if (post.image) {
      deleteFile(post.image.slice(1));
    }
    if (post.video) {
      deleteFile(post.video.slice(1));
    }
    res.status(200).json(post);
  } catch (error) {
    handleError(error, res);
  }
};

export { getAllPosts, createPost, getOnPost, updatePost, deletePost };
