"use client";

import {
  Button,
  Field,
  FieldError,
  FieldLabel,
  Input,
} from "@/shared/components/ui";
import { buttonVariants } from "@/shared/components/ui/button";
import ROUTES from "@/shared/constants/routes";

import { cn } from "@/shared/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  Controller,
  type DefaultValues,
  type FieldValues,
  type Path,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import type z from "zod";
import type { ZodType } from "zod";

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean }>;
  formType: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps<T>) => {
  const form = useForm<z.infer<typeof schema>>({
    // biome-ignore lint/suspicious/noExplicitAny: <>
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

  const handleSubmit: SubmitHandler<T> = async () => {};
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
      {Object.keys(defaultValues).map((field) => (
        <Controller
          key={field}
          name={field as Path<T>}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {field.name === "email"
                  ? "Email Address"
                  : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
              </FieldLabel>
              <Input
                {...field}
                required
                type={field.name === "password" ? "password" : "text"}
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="input-base"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      ))}

      <Button
        disabled={form.formState.isSubmitting}
        className="min-h-12 w-full"
      >
        {form.formState.isSubmitting
          ? buttonText === "Sign In"
            ? "Signin In..."
            : "Signing Up..."
          : buttonText}
      </Button>

      {formType === "SIGN_IN" ? (
        <p className="text-center">
          Don't have an Account?{" "}
          <Link
            href={ROUTES.SIGNUP}
            className={cn(buttonVariants({ variant: "link" }), "px-1 text-md")}
          >
            Sign up
          </Link>
        </p>
      ) : (
        <p className=" text-center">
          Already have an Account?{" "}
          <Link
            href={ROUTES.SIGNIN}
            className={cn(buttonVariants({ variant: "link" }), "px-1 text-md")}
          >
            Sign in
          </Link>
        </p>
      )}
    </form>
  );
};
export default AuthForm;
