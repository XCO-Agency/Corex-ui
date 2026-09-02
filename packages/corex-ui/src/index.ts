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

export type { Alignment, ButtonVariant, Size, Tone, TextVariant } from "./types/common";
