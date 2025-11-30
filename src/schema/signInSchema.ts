import z from "zod";

export const signInSchema = z.object({
  email: z.string(),
  password: z.string().min(6),
});

export type signInType = z.infer<typeof signInSchema>;
