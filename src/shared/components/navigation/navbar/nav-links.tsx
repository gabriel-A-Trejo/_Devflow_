"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SheetClose } from "../../ui";
import React from "react";
import ROUTES from "@/shared/constants/routes";
import { navigationLinks } from "@/shared/constants/navigation-links";

interface NavLinksProps {
  isMobileNav?: boolean;
  userId?: string;
}

const NavLinks = ({ isMobileNav = false, userId }: NavLinksProps) => {
  const pathname = usePathname();

  return (
    <>
      {navigationLinks.map((item) => {
        const Icon = item.icon;

        const route =
          item.route === ROUTES.PROFILES && userId
            ? `${item.route}/${userId}`
            : item.route;

        const isActive =
          route === ROUTES.HOME
            ? pathname === ROUTES.HOME
            : pathname.startsWith(route);

        const NavLinkItems = (
          <Link
            key={route}
            href={route}
            className={clsx(
              "flex items-center justify-start gap-4 rounded-xl p-4 text-muted-foreground transition-colors",
              isActive && "bg-primary text-white font-bold",
              !isActive && "hover:bg-muted",
            )}
          >
            <Icon />
            <span className={clsx(!isMobileNav && "max-lg:hidden")}>
              {item.label}
            </span>
          </Link>
        );

        return isMobileNav ? (
          <SheetClose asChild key={route}>
            {NavLinkItems}
          </SheetClose>
        ) : (
          <React.Fragment key={route}>{NavLinkItems}</React.Fragment>
        );
      })}
    </>
  );
};

export default NavLinks;
