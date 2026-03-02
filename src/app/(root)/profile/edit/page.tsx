import { auth } from "@/auth";
import { getUser } from "@/features/user/actions/get-user-details";
import ProfileForm from "@/features/user/components/profile-form";
import { Heading } from "@/shared/components/header/heading";
import ROUTES from "@/shared/constants/routes";
import type { User } from "@/shared/types/global";
import { redirect } from "next/navigation";

const profileEditPage = async () => {
  const sesssion = await auth();
  if (!sesssion?.user?.id) redirect(ROUTES.SIGNIN);

  const { success, data } = await getUser({ userId: sesssion.user.id });
  if (!success) redirect(ROUTES.SIGNIN);

  return (
    <>
      <Heading>Edit Profile</Heading>
      <section className="mt-8">
        <ProfileForm user={data?.user as User} />
      </section>
    </>
  );
};

export default profileEditPage;
