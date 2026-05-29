import { z } from "zod";

export const postCreateSchema = z.object({
  title: z.string().nonempty("Title is required"),
  content: z.string().nonempty("Content is required"),
  userId: z.number().int().positive("User ID must be a positive integer"),
});

export const postUpdateSchema = postCreateSchema.partial();

export type CreatePostInput = z.infer<typeof postCreateSchema>;
export type UpdatePostInput = z.infer<typeof postUpdateSchema>;
