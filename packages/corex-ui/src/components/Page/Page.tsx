import { cloneElement, forwardRef, isValidElement } from "react";
import type { ReactNode } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { devWarning } from "../../utils/devWarning";
import { Button } from "../Button";
import { Link } from "../Link";
import type {
  PageActionDescriptorType,
  PageBackActionType,
  PageMenuActionDescriptorType,
  PagePrimaryActionType,
  PagePropsType,
} from "./Page.types";

const SPage = createWebComponent<HTMLElement>("s-page");

type PageActionSlot = "primary-action" | "secondary-actions";

function renderActionButton(
  action: PageActionDescriptorType,
  slot: PageActionSlot,
  key?: string | number,
) {
  const { content, children, onAction, onClick, variant, ...buttonProps } = action;
  const isPrimary = slot === "primary-action";
  const secondaryVariant =
    variant === "secondary" || variant === "auto" ? variant : undefined;

  if (isPrimary && variant !== undefined && variant !== "primary") {
    devWarning(
      "Page",
      `primaryAction variant "${String(variant)}" is ignored. The primary-action slot only accepts variant "primary".`,
    );
  }
  if (!isPrimary && variant !== undefined && secondaryVariant === undefined) {
    devWarning(
      "Page",
      `secondaryActions variant "${String(variant)}" is ignored. The secondary-actions slot only accepts "secondary" or "auto".`,
    );
  }

  return (
    <Button
      {...buttonProps}
      key={key}
      slot={slot}
      variant={isPrimary ? "primary" : secondaryVariant}
      onClick={
        onAction
          ? (event) => {
              onClick?.(event);
              onAction();
            }
          : onClick
      }
    >
      {content ?? children}
    </Button>
  );
}

function renderPrimaryAction(primaryAction?: PagePrimaryActionType | ReactNode) {
  if (!primaryAction) return null;

  if (isValidElement(primaryAction)) {
    const slot = (primaryAction.props as { slot?: string })?.slot;
    return cloneElement(primaryAction, {
      slot: slot ?? "primary-action",
    } as Record<string, unknown>);
  }

  return renderActionButton(primaryAction as PagePrimaryActionType, "primary-action");
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
        return renderActionButton(item, "secondary-actions", item.id ?? index);
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

  // `<s-page>` only projects a light-DOM child that actually has `slot="aside"`.
  // Host elements accept that attribute. A composite component (for example
  // `aside={<RecommendationsInfo />}`) does not: `slot` stays a React prop and
  // never reaches the DOM, so the node falls through into the main column.
  if (isValidElement(aside) && typeof aside.type === "string") {
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

  if (titleHidden) {
    devWarning("Page", "`titleHidden` is not supported on `s-page`.");
  }

  const resolvedHeading = heading ?? (typeof title === "string" ? title : undefined);

  const resolvedInlineSize =
    inlineSize ?? (fullWidth ? "large" : narrowWidth ? "small" : undefined);

  return (
    <SPage ref={ref} heading={resolvedHeading} inlineSize={resolvedInlineSize} {...rest}>
      {renderBreadcrumbActions(breadcrumbActions, backAction)}
      {renderPrimaryAction(primaryAction)}
      {renderSecondaryActions(secondaryActions)}
      {renderAccessory(accessory, titleMetadata, additionalMetadata)}
      {renderAside(aside)}
      {children}
    </SPage>
  );
});
