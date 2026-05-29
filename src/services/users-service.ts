import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export function getUsers() {
  return db.select().from(users);
}

export async function getUserById(id: number) {
  const results = await db.select().from(users).where(eq(users.id, id));
  if (results.length) return results[0];
  throw new Error("User not found");
}
