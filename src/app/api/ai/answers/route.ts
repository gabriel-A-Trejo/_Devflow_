import { AIAnswerSchema } from "@/features/question/schema/ai-answer-schema";
import handleError from "@/shared/lib/handlers/errors";
import { ValidationError } from "@/shared/lib/http-errors";
import type { APIErrorResponse, APIResponse } from "@/shared/types/global";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<APIResponse<string>> {
  const { question, content } = await req.json();

  try {
    const validatedData = AIAnswerSchema.safeParse({ question, content });

    if (!validatedData.success) {
      throw new ValidationError(
        validatedData.error.flatten().fieldErrors,
      ) as ValidationError;
    }

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `Generate an markdown-formatted response to the following question: ${question}. Base it on the provided content: ${content} `,
      system:
        "You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax for heading, lists, code blocks, and emphasis where necessary. For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.).",
    });

    return NextResponse.json({ success: true, data: text }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
