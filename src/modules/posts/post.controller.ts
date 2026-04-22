import { request, type Request, type Response } from "express";
import { PostService } from "./post.service";
import { Post } from "../../generated/prisma/browser";
import { GetAllResponse } from "../../common/types/apiResponse";

import { PostQueryDto } from "./post.types";
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
    const { title, image, content } = req.body;
    const post = await PostService.createPost({
      title,
      image,
      content,
    });
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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
    const data = req.body;
    const post = await PostService.updatePost(data, id);
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteManyPosts = async (req: Request, res: Response) => {
  try {
    const ids = req.body.ids;
    const post = await PostService.deleteManyPosts(ids);
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getAllPosts, createPost, getOnPost, updatePost, deleteManyPosts };
