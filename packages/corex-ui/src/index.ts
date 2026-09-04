// Public entry point. Only what's exported here is part of the package's
// public API — internal `core`/`utils`/`test-utils` modules are intentionally
// not re-exported.

export { Button } from "./components/Button";
export type { ButtonProps, ButtonPropsType, ButtonType } from "./components/Button";

export { ButtonGroup } from "./components/ButtonGroup";
export type { ButtonGroupProps } from "./components/ButtonGroup";

export { Text } from "./components/Text";
export type { TextProps, TextPropsType } from "./components/Text";

export { Badge } from "./components/Badge";
export type { BadgeProps, BadgePropsType, BadgeStatusType } from "./components/Badge";

export { Banner } from "./components/Banner";
export type { BannerProps, BannerPropsType, BannerActionType } from "./components/Banner";

export { Box } from "./components/Box";
export type { BoxProps, BoxPropsType } from "./components/Box";

export { BlockStack } from "./components/BlockStack";
export type { BlockStackProps, BlockStackPropsType } from "./components/BlockStack";

export { InlineStack } from "./components/InlineStack";
export type { InlineStackProps, InlineStackPropsType } from "./components/InlineStack";

export { Card } from "./components/Card";
export type { CardProps, CardPropsType, CardActionType } from "./components/Card";

export { Modal } from "./components/Modal";
export type { ModalAction, ModalProps } from "./components/Modal";

export { TextField } from "./components/TextField";
export type { TextFieldProps } from "./components/TextField";

export { Select } from "./components/Select";
export type { SelectOption, SelectProps } from "./components/Select";

export { Checkbox } from "./components/Checkbox";
export type { CheckboxProps } from "./components/Checkbox";

export { Spinner } from "./components/Spinner";
export type { SpinnerProps } from "./components/Spinner";

export { Page } from "./components/Page";
export type {
  PageProps,
  PagePropsType,
  PageInlineSize,
  PageInlineSizeType,
  PagePrimaryAction,
  PagePrimaryActionType,
  PageMenuActionDescriptor,
  PageMenuActionDescriptorType,
  PageMenuGroupDescriptor,
  PageMenuGroupDescriptorType,
  PageBackAction,
  PageBackActionType,
  PagePaginationProps,
  PagePaginationPropsType,
} from "./components/Page";

export { Tabs } from "./components/Tabs";
export type { TabDescriptor, TabItemType, TabsProps, TabsPropsType } from "./components/Tabs";


export { Link } from "./components/Link";
export type { LinkProps, LinkPropsType } from "./components/Link";

export { Clickable, ClickableAction } from "./components/Clickable";
export type {
  ClickableProps,
  ClickablePropsType,
  ClickableActionProps,
  ClickableActionPropsType,
  ClickableBoxPropsType,
  ClickableBasePropsType,
  ClickableTargetType,
  ClickableButtonType,
} from "./components/Clickable";

export { Icon } from "./components/Icon";
export type { IconProps, IconPropsType, IconSourceType } from "./components/Icon";

export { Divider } from "./components/Divider";
export type { DividerProps } from "./components/Divider";

export { Avatar } from "./components/Avatar";
export type { AvatarProps } from "./components/Avatar";

export { Thumbnail } from "./components/Thumbnail";
export type { ThumbnailProps } from "./components/Thumbnail";

export { Tooltip } from "./components/Tooltip";
export type { TooltipProps } from "./components/Tooltip";

export { ChoiceList } from "./components/ChoiceList";
export type { ChoiceListOption, ChoiceListProps } from "./components/ChoiceList";

export { DateField } from "./components/DateField";
export type { DateFieldProps } from "./components/DateField";

export { DatePicker } from "./components/DatePicker";
export type { DatePickerProps } from "./components/DatePicker";

export { Menu } from "./components/Menu";
export type { MenuProps } from "./components/Menu";

export { Navigation, Navigations } from "./components/Navigation";
export type {
  NavigationProps,
  NavigationPropsType,
  NavigationItemType,
  NavigationSectionType,
} from "./components/Navigation";

// App Bridge (see docs/app-bridge.md) — a distinct subsystem from the
// Polaris design components above.
export { AppWindow } from "./components/AppWindow";
export type { AppWindowProps } from "./components/AppWindow";

export { AppNav } from "./components/AppNav";
export type { AppNavProps } from "./components/AppNav";

export { SaveBar } from "./components/SaveBar";
export type { SaveBarProps } from "./components/SaveBar";

export { useToast, useSaveBar } from "./hooks";
export type { UseToastResult, UseSaveBarResult } from "./hooks";
export type { ShopifyGlobal, ShopifyToastOptions } from "./types/app-bridge";

export type {
  Alignment,
  AlignmentType,
  ButtonVariant,
  ButtonVariantType,
  LegacySpacing,
  LegacySpacingType,
  PolarisSpacing,
  PolarisSpacingType,
  Size,
  SizeType,
  StackGap,
  StackGapType,
  Tone,
  ToneType,
  TextVariant,
  TextVariantType,
  Target,
  TargetType,
} from "./types/common";
