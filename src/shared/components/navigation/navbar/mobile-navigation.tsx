"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "../../ui";
import { Menu } from "lucide-react";
import Logo from "./logo";

import AuthActionLinks from "../auth-action-links";
import NavLinks from "./nav-links";

const MobileNavigation = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="sm:hidden" aria-hidden />
      </SheetTrigger>

      <SheetContent side="left" className="border-none p-3">
        <SheetTitle className="sr-only">Navigation</SheetTitle>

        <div className="flex h-full flex-col  ">
          <div className="px-3 pt-2">
            <Logo />
          </div>

          <div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto pt-8">
            <SheetClose asChild>
              <nav aria-label="Primary" className="space-y-4">
                <NavLinks isMobileNav />
              </nav>
            </SheetClose>
            <AuthActionLinks isMobile />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
