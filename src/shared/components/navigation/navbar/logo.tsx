import { ASSETS } from "@/shared/constants/assets";
import ROUTES from "@/shared/constants/routes";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  isNavbar?: boolean;
}
const Logo = ({ isNavbar = false }: LogoProps) => {
  return (
    <Link href={ROUTES.HOME} className="flex items-center gap-1">
      <Image
        src={ASSETS.LOGO.SRC}
        alt={ASSETS.LOGO.ALT}
        width={23}
        height={23}
        className="object-contain"
      />
      <p   className={clsx(
    "text-xl font-bold",
    isNavbar && "max-sm:hidden"
  )}>
        Dev<span className="text-primary">Flow</span>
      </p>
    </Link>
  );
};

export default Logo;
