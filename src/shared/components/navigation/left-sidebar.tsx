import NavLinks from "./navbar/nav-links";
import AuthActionLinks from "./auth-action-links";
import { auth } from "@/auth";

const LeftSidebar = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <aside className="no-scrollbar sticky left-0 top-0 h-screen flex flex-col justify-between overflow-y-auto p-6 pt-23 bg-background max-sm:hidden">
      <div className="flex flex-1 flex-col gap-6">
        <NavLinks userId={userId} />
      </div>
      <AuthActionLinks userId={userId} />
    </aside>
  );
};

export default LeftSidebar;
