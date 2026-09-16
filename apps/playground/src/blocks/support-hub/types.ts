export type SupportTeamMemberType = {
  name: string;
  role?: string;
  avatarUrl?: string;
  initials?: string;
};

export type SupportHoursType = {
  days: string;
  time: string;
  timezone: string;
};

export type SupportQuickLinkType = {
  id: string;
  title: string;
  description: string;
  iconType: "feature-request" | "faq" | "docs" | "community";
  url?: string;
  onClick?: () => void;
};

export type SupportHubPropsType = {
  heading?: string;
  needHelpTitle?: string;
  teamLabel?: string;
  teamMembers?: SupportTeamMemberType[];
  contactHeading?: string;
  hours?: SupportHoursType;
  email?: string;
  onChatClick?: () => void;
  onBookCallClick?: () => void;
  onEmailClick?: () => void;
  quickLinks?: SupportQuickLinkType[];
};
