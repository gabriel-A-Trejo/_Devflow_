import {
  Briefcase,
  House,
  Star,
  Users,
  Tag,
  User,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import ROUTES from "./routes";


export interface NavigationLinks {
  icon: LucideIcon;
  route: string;
  label: string;
}

export const navigationLinks: NavigationLinks[] = [
  {
    icon: House,
    route: ROUTES.HOME,
    label: "Home",
  },
  {
    icon: Users,
    route: ROUTES.COMMUNITIES,
    label: "Community",
  },
  {
    icon: Star,
    route: ROUTES.COLLECTIONS,
    label: "Collections",
  },
  {
    icon: Briefcase,
    route: ROUTES.JOBS,
    label: "Find Jobs",
  },
  {
    icon: Tag,
    route: ROUTES.TAGS,
    label: "Tags",
  },
  {
    icon: User,
    route: ROUTES.PROFILES,
    label: "Profile",
  },
  {
    icon: HelpCircle,
    route: ROUTES.ASK_QUESTION,
    label: "Ask a question",
  },
] as const;
