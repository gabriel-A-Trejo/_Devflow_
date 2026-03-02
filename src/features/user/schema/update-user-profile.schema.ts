import z from "zod";

export const updateUserProfileSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces."),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters long.")
    .max(30, "Username cannot exceed 30 characters.")
    .regex(
      /^[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*$/,
      "Username can contain letters, numbers, underscores, and hyphens (no consecutive hyphens, not starting or ending with hyphen).",
    ),

  portfolio: z.url("Please provide a Valid url").optional().or(z.literal("")),

  location: z.string().trim().min(2, "Please provide a proper location"),

  bio: z.string().trim().min(3, "Bio must be at least 3 characters long"),
});
