import type {
  SupportTeamMemberType,
  SupportHoursType,
  SupportQuickLinkType,
} from "./types";
import {
  AVATAR_IHAR,
  AVATAR_MARINA,
  AVATAR_ANDRII,
} from "./avatars-data";

export const DEFAULT_TEAM_MEMBERS: SupportTeamMemberType[] = [
  {
    name: "Ihar",
    role: "Customer Care",
    avatarUrl: AVATAR_IHAR,
  },
  {
    name: "Marina",
    role: "Customer Care",
    avatarUrl: AVATAR_MARINA,
  },
  {
    name: "Andrii",
    role: "Customer Care",
    avatarUrl: AVATAR_ANDRII,
  },
];

export const DEFAULT_SUPPORT_HOURS: SupportHoursType = {
  days: "Mon – Fri",
  time: "9:00 AM – 6:00 PM",
  timezone: "EEST",
};

export const DEFAULT_SUPPORT_EMAIL = "support@cartly-pro.com";

export const DEFAULT_QUICK_LINKS: SupportQuickLinkType[] = [
  {
    id: "feature-request",
    title: "Feature Request",
    description: "Suggest feature or report bug. We value your feedback",
    iconType: "feature-request",
  },
  {
    id: "faq",
    title: "Frequently asked questions (FAQ)",
    description: "Find documentation and tutorials on how to use the app",
    iconType: "faq",
  },
];
