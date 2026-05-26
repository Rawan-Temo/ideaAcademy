import { Request } from "express";
import { postRepository } from "./post.repository";
import { CreatePostDTO, UpdatePostDTO, PostQueryDto } from "./post.types";

export const PostService = {
  getAllPosts: (query: PostQueryDto) => {
    return postRepository.getAll(query);
  },
  createPost: (data: CreatePostDTO) => {
    return postRepository.create(data);
  },
  getPostById: (id: any) => {
    return postRepository.getById(id);
  },
  updatePost: (data: UpdatePostDTO, id: any) => {
    return postRepository.update(data, id);
  },
  deletePost: (id: string) => {
    return postRepository.deleteOne(id);
  },
  deleteManyPosts: (ids: any[]) => {
    return postRepository.deleteMany(ids);
  },
};
