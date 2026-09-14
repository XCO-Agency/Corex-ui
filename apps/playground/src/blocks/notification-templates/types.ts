export type TemplateChannelType = "sms" | "email";

export type VariableTagType = {
  key: string;
  label: string;
  category: "order" | "customer" | "shop";
  sampleValue: string;
};

export type NotificationTemplateFormType = {
  name: string;
  channel: TemplateChannelType;
  subject: string;
  bodyText: string;
  senderName: string;
  enabled: boolean;
};
