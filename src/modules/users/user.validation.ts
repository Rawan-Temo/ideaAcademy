import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6),
});
