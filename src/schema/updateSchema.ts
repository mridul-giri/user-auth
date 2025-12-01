import z from "zod";

export const updateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  image: z.string().optional(),
  currentPassword: z.string().min(6).optional(),
  newPassword: z.string().min(6).optional(),
});

export type UpdateSchemaType = z.infer<typeof updateSchema>;
