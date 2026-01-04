"use client";

import AuthForm from "@/features/auth/components/auth-form";
import { SignUpSchema } from "@/features/auth/schema/auth-schema";

const SignUp = () => {
  return (
    <AuthForm
      formType="SIGN_UP"
      schema={SignUpSchema}
      defaultValues={{ name: "", username: "", email: "", password: "" }}
      onSubmit={(data) => Promise.resolve({ success: true, data })}
    />
  );
};

export default SignUp;
