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
import { auth } from "@/auth";

const MobileNavigation = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="sm:hidden" aria-hidden />
      </SheetTrigger>

      <SheetContent side="left" className="border-none p-3 ">
        <SheetTitle className="sr-only">Navigation</SheetTitle>

        <div className="flex h-full flex-col  ">
          <div className="px-3 pt-2">
            <Logo />
          </div>

          <div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto pt-8 ">
            <SheetClose asChild>
              <nav aria-label="Primary" className="space-y-4">
                <NavLinks isMobileNav userId={userId} />
              </nav>
            </SheetClose>
            <AuthActionLinks isMobile userId={userId} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
