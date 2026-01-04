import React from "react";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export const Heading = ({ children, className = "" }: HeadingProps) => {
  return <h1 className={`font-bold text-3xl ${className}`}>{children}</h1>;
};
