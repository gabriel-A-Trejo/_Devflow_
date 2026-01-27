import LeftSidebar from "@/shared/components/navigation/left-sidebar";
import Navbar from "@/shared/components/navigation/navbar";
import RightSideBar from "@/shared/components/navigation/right-side-bar";
import type { ReactNode } from "react";

async function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="relative">
      <Navbar />
      <div className="flex">
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-25 max-md:pb-14 sm:px-14 no-scrollbar  ">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        <RightSideBar />
      </div>
    </main>
  );
}

export default Layout;
