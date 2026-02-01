import type { ReactNode } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardAction,
} from "../ui";

interface CompactCardProps {
  cardClassName?: string;
  title: string;
  contentClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  description?: string;
  content: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
}
const CompactCard = ({
  cardClassName,
  headerClassName,
  title,
  titleClassName,
  description,
  content,
  action,
  footer,
  contentClassName,
}: CompactCardProps) => {
  return (
    <Card className={cardClassName}>
      <CardHeader className={headerClassName}>
        <CardTitle className={titleClassName}>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <CardAction>{action}</CardAction>
      </CardHeader>

      <CardContent className={contentClassName}>{content}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

export default CompactCard;
