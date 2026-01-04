import Image from "next/image";
import Link from "next/link";
import React from "react";
import { LucideIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui";

interface Props {
  imgUrl?: string;
  alt?: string;
  icon?: LucideIcon;
  userName?: string;
  value: string | number;
  title: string;
  href?: string;
  textStyles: string;
  imgStyles?: string;
  titleStyles?: string;
}

export const Metric = ({
  imgUrl,
  alt,
  icon: Icon,
  userName,
  value,
  title,
  href,
  textStyles,
  imgStyles,
  titleStyles,
}: Props) => {
  const renderMedia = () => {
    if (imgUrl) {
      return (
        <Avatar className={cn("size-8 border-2 border-secondary", imgStyles)}>
          <AvatarImage
            src={imgUrl}
            alt={alt ?? "User avatar"}
            className="object-cover"
          />
          <AvatarFallback>
            {userName ? userName.slice(0, 2).toUpperCase() : "NA"}
          </AvatarFallback>
        </Avatar>
      );
    }

    if (Icon) {
      return (
        <Icon className={cn("h-4 w-4 text-muted-foreground", imgStyles)} />
      );
    }

    return null;
  };

  const metricContent = (
    <div className="flex items-center gap-2">
      {renderMedia()}
      <p className={cn("flex items-center gap-1", textStyles)}>
        {href ? (
          <Link
            href={href}
            className={cn(
              "hover:text-muted-foreground cursor-pointer",
              textStyles,
            )}
          >
            {value}
          </Link>
        ) : (
          <span>{value}</span>
        )}
        <span className={cn("small-regular line-clamp-1", titleStyles)}>
          {title}
        </span>
      </p>
    </div>
  );

  return <div className="flex-center gap-1">{metricContent}</div>;
};
