import { z } from "zod";

export const createPostSchema = z
  .object({
    title: z.string().min(3).max(1000),
    content: z.string().min(100),
    image: z.string().optional(),
    video: z.string().optional(),
  })
  .strict();

export const updatePostSchema = z
  .object({
    title: z.string().min(3).max(1000).optional(),
    content: z.string().min(100).optional(),
    image: z.string().optional(),
    video: z.string().optional(),
  })
  .strict();
