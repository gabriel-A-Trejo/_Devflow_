import z from "zod";

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters.")
    .max(130, "Title musn't be longer then 130 characters."),
  content: z.string().min(100, "Minimum of 100 characters."),
  tags: z
    .array(
      z
        .string()
        .min(1, "Tag must have at least 1 character.")
        .max(15, "Tag must not exceed 15 characters."),
    )
    .min(1, "Add at least one tag.")
    .max(3, "Maximum of 3 tags."),
});
