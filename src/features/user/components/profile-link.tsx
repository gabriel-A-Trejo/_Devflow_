import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/components/ui/button";

interface Props {
  icon: LucideIcon;
  href?: string;
  title: string;
}

const ProfileLink = ({ icon: Icon, href, title }: Props) => {
  return (
    <div className="flex-center gap-1">
      <Icon className="size-4 text-muted-foreground" />
      {href ? (
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "link" }))}
        >
          {title}
        </Link>
      ) : (
        <p>{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
