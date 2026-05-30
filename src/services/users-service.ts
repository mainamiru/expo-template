import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getDb } from "./db-service";

export async function getUsers() {
  const db = await getDb();
  return db.select().from(users);
}

export async function getUserById(id: number) {
  const db = await getDb();
  const results = await db.select().from(users).where(eq(users.id, id));
  if (results.length) return results[0];
  throw new Error("User not found");
}
