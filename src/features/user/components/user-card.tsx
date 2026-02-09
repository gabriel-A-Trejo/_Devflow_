import CompactCard from "@/shared/components/compact/compact-card";
import UserAvatar from "@/shared/components/navigation/navbar/userAvatar";
import ROUTES from "@/shared/constants/routes";
import type { User } from "@/shared/types/global";
import Link from "next/link";

const UserCard = ({ _id, name, image, username }: User) => {
  return (
    <CompactCard
      title={_id}
      titleClassName="sr-only"
      headerClassName="hidden"
      content={
        <article className="flex h-full flex-col items-center justify-center p-8 text-center">
          <UserAvatar
            id={_id}
            name={name}
            imageUrl={image}
            className="size-[140px] rounded-full object-cover"
            fallbackClassName="flex items-center justify-center text-3xl font-medium"
          />

          <Link
            href={ROUTES.PROFILE(_id)}
            className="mt-5 space-y-1 focus:outline-none"
          >
            <h3 className="text-xl font-semibold leading-tight line-clamp-1">
              {name}
            </h3>
            <p className="text-md text-muted-foreground line-clamp-1">
              @{username}
            </p>
          </Link>
        </article>
      }
    />
  );
};

export default UserCard;
