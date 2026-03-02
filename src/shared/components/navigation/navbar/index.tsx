import { auth } from "@/auth";
import Logo from "./logo";
import MobileNavigation from "./mobile-navigation";
import ThemeToggle from "./theme-toggle";
import UserAvatar from "./userAvatar";
import GlobalSearch from "@/features/search/components/global-search";

const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="flex-between bg-background fixed z-50 w-full p-6 sm:px-12 gap-5 ">
      <Logo isNavbar />
      <GlobalSearch />
      <div className="flex-between gap-5">
        <ThemeToggle />
        {session?.user?.id && (
          <UserAvatar
            id={session.user.id}
            name={session.user.name!}
            imageUrl={session.user?.image}
          />
        )}
        <MobileNavigation />
      </div>
    </nav>
  );
};

export default Navbar;
