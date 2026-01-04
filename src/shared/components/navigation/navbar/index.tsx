import Logo from "./logo";
import MobileNavigation from "./mobile-navigation";
import ThemeToggle from "./theme-toggle";

const Navbar = () => {
  return (
    <nav className="flex-between bg-background fixed z-50 w-full p-6 sm:px-12 gap-5 ">
      <Logo isNavbar />
      <p>Global Search</p>
      <div className="flex-between gap-5">
        <ThemeToggle />
        <MobileNavigation />
      </div>
    </nav>
  );
};

export default Navbar;
