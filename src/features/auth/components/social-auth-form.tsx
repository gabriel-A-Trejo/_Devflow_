"use client";

import { Button } from "@/shared/components/ui";
import { ASSETS } from "@/shared/constants/assets";
import ROUTES from "@/shared/constants/routes";


import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SocialAuthForm = () => {
  const router = useRouter();
  const handleSignIn = async (provider: "github" | "google") => {
    try {
       await signIn(provider, {
        callbackUrl: ROUTES.HOME,
        
      });

     
    } catch (error) {
      toast.error("Authentication failed", {
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during authentication",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2.5 w-full">
      <Button
        onClick={() => handleSignIn("github")}
        variant="outline"
        className="rounded-lg min-h-12 flex-1 w-full"
      >
        <Image
          src={ASSETS.GITHUB.SRC}
          alt={ASSETS.GITHUB.ALT}
          width={20}
          height={20}
          className="invert dark:invert-0 object-contain"
        />
        <span>Continue with GitHub</span>
      </Button>

      <Button
        onClick={() => handleSignIn("google")}
        variant="outline"
        className="rounded-lg min-h-12 flex-1 w-full"
      >
        <Image
          src={ASSETS.GOOGLE.SRC}
          alt={ASSETS.GOOGLE.ALT}
          width={20}
          height={20}
          className="object-contain"
        />
        <span>Continue with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
