"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { AskQuestionSchema } from "../schema/ask-a-question-schema";
import {
  Button,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
} from "@/shared/components/ui";
import dynamic from "next/dynamic";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import type z from "zod";
import TagCard from "@/features/tags/components/tag-card";

const Editor = dynamic(() => import("@/features/editor"), {
  ssr: false,
});

const QuestionForm = () => {
  const editorRef = useRef<MDXEditorMethods>(null);
  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
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

  const handleCreateQuestion = (data: z.infer<typeof AskQuestionSchema>) => {
    console.log(data);
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
                required
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

      <Button type="submit" className="px-4 py-6 w-full">
        Ask A Question
      </Button>
    </form>
  );
};

export default QuestionForm;
