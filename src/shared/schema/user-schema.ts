import z from "zod";

export const UserSchema = z.object({
  name: z.string().min(1, "Name is required."),
  username: z.string().min(3, "username must be at least 3 characters long."),
  email: z.email("Please provide a valid email address."),
  bio: z.string().optional(),
  image: z.url("Please provide a valid URL").optional(),
  location: z.string().optional(),
  portfolio: z.url("Please provide a valid URL.").optional(),
  reputation: z.number().optional(),
});
