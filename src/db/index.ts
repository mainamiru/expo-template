import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

const expo = openDatabaseSync("myapp.db"); // change this to your database name
export const db = drizzle(expo, { schema });
