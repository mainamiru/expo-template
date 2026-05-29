import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { users } from "../schema";

export type UserModel = InferSelectModel<typeof users>;
export type UserCreateModel = InferInsertModel<typeof users>;
