import { schema } from "@/db";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";

export const getDb = async () => {
  const sqlite = await SQLite.openDatabaseAsync("myapp.db");
  return drizzle(sqlite, { schema });
};
