"use client";

import Link from "next/link";

import { cn } from "@/shared/lib/utils";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import clsx from "clsx";

import { SheetClose } from "../ui";
import ROUTES from "@/shared/constants/routes";
import { signOutAction } from "@/features/auth/actions/auth-signout";

interface AuthActionLinksProps {
  isMobile?: boolean;
  userId?: string | null;
}

const AuthActionLinks = ({
  isMobile = false,
  userId,
}: AuthActionLinksProps) => {
  const Wrapper = isMobile ? SheetClose : "div";
  const wrapperProps = isMobile ? { asChild: true } : {};

  return (
    <div className="flex flex-col gap-3 ">
      {userId ? (
        <form action={signOutAction}>
          <Wrapper {...wrapperProps}>
            <Button
              type="submit"
              className={cn(
                buttonVariants({ variant: "default" }),
                "flex items-center gap-3 rounded-lg w-full cursor-pointer py-5",
              )}
            >
              {!isMobile && <LogOut className="lg:hidden" />}
              <span className={clsx(!isMobile && "max-lg:hidden")}>Logout</span>
            </Button>
          </Wrapper>
        </form>
      ) : (
        <>
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
              {!isMobile && <UserPlus className="lg:hidden" aria-hidden />}
              <span className={clsx(!isMobile && "max-lg:hidden")}>
                Sign Up
              </span>
            </Link>
          </Wrapper>
        </>
      )}
    </div>
  );
};

export default AuthActionLinks;
