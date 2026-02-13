"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useRef, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { AskQuestionSchema } from "../schema/ask-a-question-schema";
import {
  Button,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  Spinner,
  toast,
} from "@/shared/components/ui";
import dynamic from "next/dynamic";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import type z from "zod";
import TagCard from "@/features/tags/components/tag-card";
import { createQuestion, EditQuestion } from "../actions/question.action";
import { useRouter } from "next/navigation";
import ROUTES from "@/shared/constants/routes";
import { Question } from "@/shared/types/global";

const Editor = dynamic(() => import("@/shared/components/editor"), {
  ssr: false,
});

interface Params {
  question?: Question;
  isEdit?: boolean;
}

const QuestionForm = ({ question, isEdit = false }: Params) => {
  const router = useRouter();
  const editorRef = useRef<MDXEditorMethods>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: question?.title || "",
      content: question?.content || "",
      tags: question?.tags.map((tag) => tag.name) || [],
    },
  });

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[] },
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tagInput = e.currentTarget.value.trim();

      if (
        tagInput &&
        tagInput.length <= 15 &&
        !field.value.includes(tagInput)
      ) {
        form.setValue("tags", [...field.value, tagInput]);
        e.currentTarget.value = "";
        form.clearErrors("tags");
      } else if (tagInput.length > 15) {
        form.setError("tags", {
          type: "manual",
          message: "Tag must not exceed 15 characters.",
        });
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists.",
        });
      }
    }
  };

  const handleTagRemove = (tag: string, field: { value: string[] }) => {
    const newTags = field.value.filter((t) => t !== tag);
    form.setValue("tags", newTags);

    if (newTags.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "At least one tag is required.",
      });
    }
  };

  const handleCreateQuestion = async (
    data: z.infer<typeof AskQuestionSchema>,
  ) => {
    startTransition(async () => {
      if (isEdit && question) {
        const result = await EditQuestion({
          questionId: question._id,
          ...data,
        });

        if (result.success) {
          toast.success("Question updated successfully");
          if (result.data)
            router.push(ROUTES.QUESTION(String(result.data._id)));
        } else {
          toast.error(`Error ${result.status}`, {
            description: result.error?.message || "Something went wrong.",
          });
        }
        return;
      }

      const result = await createQuestion(data);

      if (result.success) {
        toast.success("Question created successfully");
        if (result.data) router.push(ROUTES.QUESTION(result.data._id));
      } else {
        toast.error(`Error ${result.status}`, {
          description: result.error?.message || "Something went wrong.",
        });
      }
    });
  };

  return (
    <form
      className="flex w-full flex-col gap-10"
      onSubmit={form.handleSubmit(handleCreateQuestion)}
    >
      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Question Title <span className="text-primary">*</span>
            </FieldLabel>
            <Input
              {...field}
              required
              type="text"
              id={field.name}
              aria-invalid={fieldState.invalid}
              className="input-base"
            />
            <FieldDescription>
              Write a clear, concise title that summarizes your problem.
            </FieldDescription>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="content"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              Question Details <span className="text-primary">*</span>
            </FieldLabel>
            <Editor
              value={field.value}
              editorRef={editorRef}
              fieldChange={field.onChange}
            />
            <FieldDescription>
              Provide all relevant details, code snippets, and context needed to
              understand and solve your problem.
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="tags"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
            className="flex w-full flex-col gap-3"
          >
            <FieldLabel htmlFor={field.name}>
              Tags <span className="text-primary">*</span>
            </FieldLabel>
            <div>
              <Input
                type="text"
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="input-base"
                placeholder="Add tags..."
                onKeyDown={(e) => handleInputKeyDown(e, field)}
              />
              {field.value.length > 0 && (
                <div className="flex-start mt-2.5 flex-wrap gap-2.5 ">
                  {field.value.map((tag: string) => (
                    <TagCard
                      key={tag}
                      _id={tag}
                      name={tag}
                      compact
                      remove
                      isButton
                      handleRemove={() => handleTagRemove(tag, field)}
                    />
                  ))}
                </div>
              )}
            </div>

            <FieldDescription>
              Add up to 3 relevant tags to help others find and answer your
              question. Press Enter to add a tag.
            </FieldDescription>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button type="submit" disabled={isPending} className="px-4 py-6 w-full">
        {isPending ? (
          <>
            <Spinner />
            <span>Submitting</span>
          </>
        ) : (
          <> {isEdit ? "Edit" : "Ask A Question"} </>
        )}
      </Button>
    </form>
  );
};

export default QuestionForm;
