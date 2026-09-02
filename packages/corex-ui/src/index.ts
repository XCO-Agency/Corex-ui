// Public entry point. Only what's exported here is part of the package's
// public API — internal `core`/`utils`/`test-utils` modules are intentionally
// not re-exported.

export { Button } from "./components/Button";
export type { ButtonProps } from "./components/Button";

export { ButtonGroup } from "./components/ButtonGroup";
export type { ButtonGroupProps } from "./components/ButtonGroup";

export { Text } from "./components/Text";
export type { TextProps } from "./components/Text";

export { Badge } from "./components/Badge";
export type { BadgeProps } from "./components/Badge";

export { Banner } from "./components/Banner";
export type { BannerProps } from "./components/Banner";

export { Box } from "./components/Box";
export type { BoxProps } from "./components/Box";

export { BlockStack } from "./components/BlockStack";
export type { BlockStackProps } from "./components/BlockStack";

export { InlineStack } from "./components/InlineStack";
export type { InlineStackProps } from "./components/InlineStack";

export { Card } from "./components/Card";
export type { CardProps } from "./components/Card";

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
export type { PageProps } from "./components/Page";

export { Tabs } from "./components/Tabs";
export type { TabDescriptor, TabsProps } from "./components/Tabs";

export { Link } from "./components/Link";
export type { LinkProps } from "./components/Link";

export { Icon } from "./components/Icon";
export type { IconProps } from "./components/Icon";

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

export type { Alignment, ButtonVariant, Size, Tone, TextVariant } from "./types/common";
