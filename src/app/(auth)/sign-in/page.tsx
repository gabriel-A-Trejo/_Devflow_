"use client";

import AuthForm from "@/features/auth/components/auth-form";
import { SignInSchema } from "@/features/auth/schema/auth-schema";

const SignIn = () => {
  return (
    <AuthForm
      formType="SIGN_IN"
      schema={SignInSchema}
      defaultValues={{ email: "", password: "" }}
      onSubmit={(data) => Promise.resolve({ success: true, data })}
    />
  );
};

export default SignIn;
