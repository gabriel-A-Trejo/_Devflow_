import SocialAuthForm from "@/features/auth/components/social-auth-form";
import CompactCard from "@/shared/components/compact/compact-card";
import { ASSETS } from "@/shared/constants/assets";
import type { ReactNode } from "react";
import Image from "next/image";

async function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex-center min-h-screen no-scrollbar ">
      <CompactCard
        cardClassName={"w-full max-w-lg "}
        titleClassName="font-bold text-xl"
        title={"Join DevFlow"}
        description="To get your question answers"
        action={
          <Image
            src={ASSETS.LOGO.SRC}
            alt={ASSETS.LOGO.ALT}
            width={50}
            height={50}
            className="object-contain"
          />
        }
        content={children}
        footer={<SocialAuthForm />}
      />
    </main>
  );
}

export default AuthLayout;
