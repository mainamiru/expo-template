import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$onUpdateFn(() => new Date().toISOString()),
});
