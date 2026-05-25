import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10).max(1000).optional(),
});

export const updatePostSchema = z
  .object({
    title: z.string().min(3).max(100).optional(),
    content: z.string().min(10).max(1000).optional(),
    image: z.string().optional(),
    video: z.string().optional(),
  })
  .strict();
