import { z } from "zod";

export const createPostSchema = z
  .object({
    title: z.string().min(3).max(100),
    image: z.string().optional(),
    content: z.string().min(10).max(1000).optional(),
  })
  .strict();

export const updatePostSchema = z
  .object({
    title: z.string().min(3).max(100).optional(),
    image: z.string().optional(),
    content: z.string().min(10).max(1000).optional(),
  })
  .strict();
