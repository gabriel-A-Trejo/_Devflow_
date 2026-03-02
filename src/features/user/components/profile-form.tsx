"use client";

import type { User } from "@/shared/types/global";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { updateUserProfileSchema } from "../schema/update-user-profile.schema";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import {
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Spinner,
  toast,
} from "@/shared/components/ui";
import { Textarea } from "@/shared/components/ui/textarea";
import { updateUserProfile } from "../actions/update-user-profile";
import ROUTES from "@/shared/constants/routes";

interface Props {
  user: User;
}

const ProfileForm = ({ user }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof updateUserProfileSchema>>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      name: user.name ?? "",
      username: user.username ?? "",
      portfolio: user.portfolio ?? "",
      location: user.location ?? "",
      bio: user.bio ?? "",
    },
  });

  const handleSubmitProfile: SubmitHandler<
    z.infer<typeof updateUserProfileSchema>
  > = (data) => {
    startTransition(async () => {
      const res = await updateUserProfile(data);

      if (!res.success) {
        toast.error("Error", { description: res.error?.message });
        return;
      }

      toast.success("Success", { description: "Profile updated successfully" });
      if (res.data) router.push(ROUTES.PROFILE(user._id));
    });
  };

  const isLoading = isPending || form.formState.isSubmitting;

  return (
    <form
      className="flex w-full flex-col gap-10"
      onSubmit={form.handleSubmit(handleSubmitProfile)}
    >
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Name<span className="text-primary">*</span>
              </FieldLabel>
              <Input
                {...field}
                required
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Your Name"
                className="input-base"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Username<span className="text-primary">*</span>
              </FieldLabel>
              <Input
                {...field}
                required
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Your username"
                className="input-base"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="portfolio"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Portfolio</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Your portfolio link"
                className="input-base"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="location"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Location <span className="text-primary">*</span>
              </FieldLabel>
              <Input
                {...field}
                required
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Where do you live?"
                className="input-base"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="bio"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Bio <span className="text-primary">*</span>
              </FieldLabel>
              <Textarea
                {...field}
                required
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Tell something about yourself?"
                className="resize-none min-h-[120px]"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Spinner />
            Submitting...
          </div>
        ) : (
          "Submit"
        )}
      </Button>
    </form>
  );
};

export default ProfileForm;
