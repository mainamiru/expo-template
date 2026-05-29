import { db } from "@/db";
import { posts } from "@/db/schema";
import { PostCreateModel } from "@/db/types/post";
import { postCreateSchema } from "@/zod";

// Create a new post
export async function createPost(post: PostCreateModel) {
  const data = await postCreateSchema.parseAsync(post);
  const results = await db.insert(posts).values(data).returning();
  return results[0];
}

export function getPosts() {
  return db.select().from(posts);
}
