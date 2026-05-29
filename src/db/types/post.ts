import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { posts } from "../schema/posts.schema";

export type PostModel = InferSelectModel<typeof posts>;
export type PostCreateModel = InferInsertModel<typeof posts>;
