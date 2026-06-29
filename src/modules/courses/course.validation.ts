import z from "zod";

const createCourseSchema = z
  .object({
    title: z.string().min(3).max(1000),
    content: z.string().min(100),
    image: z.string().optional(),
    video: z.string().optional(),
  })
  .strict();

const updateCourseSchema = z
  .object({
    title: z.string().min(3).max(1000).optional(),
    content: z.string().min(100).optional(),
    image: z.string().optional(),
    video: z.string().optional(),
  })
  .strict();

export { createCourseSchema, updateCourseSchema };
