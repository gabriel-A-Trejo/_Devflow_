"use client";

import { useRef, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { AnswerSchema } from "../schema/answer.schema";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import {
  Button,
  Field,
  FieldError,
  Spinner,
  toast,
} from "@/shared/components/ui";
import { Sparkles } from "lucide-react";
import { CreateAnswer } from "../actions/create-answer.action";

const Editor = dynamic(() => import("@/features/editor"), {
  ssr: false,
});
const AnswerForm = ({ questionId }: { questionId: string }) => {
  const [isAnswering, startAnswerTransition] = useTransition();
  const [isAISubmitting, setIsAISubmitting] = useState(false);

  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: { content: "" },
  });

  const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    startAnswerTransition(async () => {
      const result = await CreateAnswer({
        questionId,
        content: values.content,
      });

      if (result.success) {
        form.reset();
        toast.success("Your answer has been posted successfully");
      } else {
        toast.error(result.error?.message);
      }
    });
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2 ">
        <h4 className="font-semibold text-xl ">Write your answer here</h4>
        <Button
          disabled={isAISubmitting}
          className="rounded-lg cursor-pointer  "
        >
          {isAnswering ? (
            <>
              <Spinner /> Generating...
            </>
          ) : (
            <>
              <Sparkles />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-6 flex w-full flex-col gap-10 "
      >
        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Editor
                value={field.value}
                editorRef={editorRef}
                fieldChange={field.onChange}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isAnswering}
            className="w-fit rounded-lg cursor-pointer"
          >
            {isAnswering ? (
              <>
                <Spinner /> Posting...
              </>
            ) : (
              "Post Answer"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AnswerForm;
