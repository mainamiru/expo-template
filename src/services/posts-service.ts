import { posts } from "@/db/schema";
import { PostCreateModel } from "@/db/types/post";
import { postCreateSchema } from "@/zod";
import { getDb } from "./db-service";

// Create a new post
export async function createPost(post: PostCreateModel) {
  const db = await getDb();
  const data = await postCreateSchema.parseAsync(post);
  const results = await db.insert(posts).values(data).returning();
  return results[0];
}

export async function getPosts() {
  const db = await getDb();
  return db.select().from(posts);
}
