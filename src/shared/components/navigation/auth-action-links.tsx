"use client";

import Link from "next/link";


import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import clsx from "clsx";

import { SheetClose } from "../ui";
import ROUTES from "@/shared/constants/routes";


interface AuthActionLinksProps {
  isMobile?: boolean;
}

const AuthActionLinks = ({ isMobile = false }: AuthActionLinksProps) => {
  const Wrapper = isMobile ? SheetClose : "div";
  const wrapperProps = isMobile ? { asChild: true } : {};

  return (
    <div className="flex flex-col gap-3">
      <Wrapper {...wrapperProps}>
        <Link
          href={ROUTES.SIGNIN}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "flex items-center gap-2 rounded-lg",
          )}
        >
          {!isMobile && <LogIn className="lg:hidden" aria-hidden />}
          <span className={clsx(!isMobile && "max-lg:hidden")}>Log in</span>
        </Link>
      </Wrapper>

      <Wrapper {...wrapperProps}>
        <Link
          href={ROUTES.SIGNUP}
          className={cn(
            buttonVariants({ variant: "default" }),
            "flex items-center gap-2 rounded-lg",
          )}
        >
          {!isMobile && <UserPlus className=" lg:hidden" aria-hidden />}
          <span className={clsx(!isMobile && "max-lg:hidden")}>Sign Up</span>
        </Link>
      </Wrapper>
    </div>
  );
};

export default AuthActionLinks;
