import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import * as schema from "../db/schema";

export function useDatabase() {
  const sqlite = useSQLiteContext();
  return drizzle(sqlite, { schema });
}
