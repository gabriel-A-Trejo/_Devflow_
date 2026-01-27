"use client";

import { signInWithCredentials } from "@/features/auth/actions/auth.action";
import AuthForm from "@/features/auth/components/auth-form";
import { SignInSchema } from "@/features/auth/schema/auth-schema";

const SignIn = () => {
  return (
    <AuthForm
      formType="SIGN_IN"
      schema={SignInSchema}
      defaultValues={{ email: "", password: "" }}
      onSubmit={signInWithCredentials}
    />
  );
};

export default SignIn;
