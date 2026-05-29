import { defineConfig } from "drizzle-kit";

export default defineConfig({
  driver: "expo",
  out: "./drizzle",
  dialect: "sqlite",
  schema: "./src/db/schema",
});
