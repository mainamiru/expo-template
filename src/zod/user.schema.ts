import z from "zod";

export const userCreateSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
