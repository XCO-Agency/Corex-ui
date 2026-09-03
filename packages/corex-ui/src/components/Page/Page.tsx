import { cloneElement, forwardRef, isValidElement } from "react";
import type { ReactNode } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { devWarning } from "../../utils/devWarning";
import { Button } from "../Button";
import { Link } from "../Link";
import type {
  PageBackActionType,
  PageMenuActionDescriptorType,
  PagePrimaryActionType,
  PagePropsType,
} from "./Page.types";

const SPage = createWebComponent<HTMLElement>("s-page");

function renderPrimaryAction(primaryAction?: PagePrimaryActionType | ReactNode) {
  if (!primaryAction) return null;

  if (isValidElement(primaryAction)) {
    const slot = (primaryAction.props as { slot?: string })?.slot;
    return cloneElement(primaryAction, {
      slot: slot ?? "primary-action",
    } as Record<string, unknown>);
  }

  const action = primaryAction as PagePrimaryActionType;
  return (
    <Button
      slot="primary-action"
      variant="primary"
      tone={action.destructive ? "critical" : undefined}
      disabled={action.disabled}
      loading={action.loading}
      url={action.url}
      external={action.external}
      accessibilityLabel={action.accessibilityLabel}
      id={action.id}
      onClick={action.onAction}
    >
      {action.content}
    </Button>
  );
}

function renderSecondaryActions(
  secondaryActions?: (PageMenuActionDescriptorType | ReactNode)[] | ReactNode,
) {
  if (!secondaryActions) return null;

  if (isValidElement(secondaryActions)) {
    const slot = (secondaryActions.props as { slot?: string })?.slot;
    return cloneElement(secondaryActions, {
      slot: slot ?? "secondary-actions",
    } as Record<string, unknown>);
  }

  if (Array.isArray(secondaryActions)) {
    return secondaryActions.map((action, index) => {
      if (isValidElement(action)) {
        const slot = (action.props as { slot?: string })?.slot;
        return cloneElement(action, {
          key: (action.key as string) ?? index,
          slot: slot ?? "secondary-actions",
        } as Record<string, unknown>);
      }

      if (action && typeof action === "object") {
        const item = action as PageMenuActionDescriptorType;
        return (
          <Button
            key={item.id ?? index}
            slot="secondary-actions"
            disabled={item.disabled}
            loading={item.loading}
            tone={item.destructive ? "critical" : undefined}
            url={item.url}
            external={item.external}
            accessibilityLabel={item.accessibilityLabel}
            icon={item.icon}
            id={item.id}
            onClick={item.onAction}
          >
            {item.content}
          </Button>
        );
      }

      return null;
    });
  }

  return null;
}

function renderBreadcrumbActions(
  breadcrumbActions?: ReactNode,
  backAction?: PageBackActionType,
) {
  if (breadcrumbActions) {
    if (isValidElement(breadcrumbActions)) {
      const slot = (breadcrumbActions.props as { slot?: string })?.slot;
      return cloneElement(breadcrumbActions, {
        slot: slot ?? "breadcrumb-actions",
      } as Record<string, unknown>);
    }
    return <span slot="breadcrumb-actions">{breadcrumbActions}</span>;
  }

  if (backAction) {
    return (
      <Link
        slot="breadcrumb-actions"
        url={backAction.url}
        accessibilityLabel={backAction.accessibilityLabel}
        onClick={backAction.onAction}
        id={backAction.id}
      >
        {backAction.content}
      </Link>
    );
  }

  return null;
}

function renderAside(aside?: ReactNode) {
  if (!aside) return null;
  if (isValidElement(aside)) {
    const slot = (aside.props as { slot?: string })?.slot;
    return cloneElement(aside, {
      slot: slot ?? "aside",
    } as Record<string, unknown>);
  }
  return <div slot="aside">{aside}</div>;
}

function renderAccessory(
  accessory?: ReactNode,
  titleMetadata?: ReactNode,
  additionalMetadata?: ReactNode | string,
) {
  const resolved = accessory ?? titleMetadata ?? additionalMetadata;
  if (!resolved) return null;

  if (isValidElement(resolved)) {
    const slot = (resolved.props as { slot?: string })?.slot;
    return cloneElement(resolved, {
      slot: slot ?? "accessory",
    } as Record<string, unknown>);
  }

  return <span slot="accessory">{resolved}</span>;
}

/**
 * Top-level layout wrapper over `s-page`.
 * Supports native `s-page` attributes and slots while providing complete
 * backwards compatibility for legacy Polaris `Page` props.
 */
export const Page = forwardRef<HTMLElement, PagePropsType>(function Page(
  {
    children,
    heading,
    subheading,
    inlineSize,
    aside,
    accessory,
    breadcrumbActions,
    primaryAction,
    secondaryActions,
    // Deprecated legacy props
    title,
    subtitle,
    fullWidth,
    narrowWidth,
    backAction,
    titleHidden,
    pageReadyAccessibilityLabel: _pageReadyAccessibilityLabel,
    filterActions: _filterActions,
    pagination,
    actionGroups,
    titleMetadata,
    additionalMetadata,
    compactTitle: _compactTitle,
    hasSubtitleMaxWidth: _hasSubtitleMaxWidth,
    onActionRollup: _onActionRollup,
    ...rest
  },
  ref,
) {
  if (actionGroups && actionGroups.length > 0) {
    devWarning(
      "Page",
      "`actionGroups` are not directly supported by `s-page`. Provide individual actions via `secondaryActions`.",
    );
  }

  if (pagination) {
    devWarning(
      "Page",
      "`pagination` is not directly supported on `s-page`. Render pagination directly in the page body.",
    );
  }

  if (titleHidden) {
    devWarning("Page", "`titleHidden` is not supported on `s-page`.");
  }

  const resolvedHeading = heading ?? (typeof title === "string" ? title : undefined);
  const resolvedSubheading = subheading ?? (typeof subtitle === "string" ? subtitle : undefined);
  const resolvedInlineSize =
    inlineSize ?? (fullWidth ? "large" : narrowWidth ? "small" : undefined);

  return (
    <SPage
      ref={ref}
      heading={resolvedHeading}
      subheading={resolvedSubheading}
      inlineSize={resolvedInlineSize}
      {...rest}
    >
      {renderBreadcrumbActions(breadcrumbActions, backAction)}
      {renderPrimaryAction(primaryAction)}
      {renderSecondaryActions(secondaryActions)}
      {renderAccessory(accessory, titleMetadata, additionalMetadata)}
      {renderAside(aside)}
      {children}
    </SPage>
  );
});
