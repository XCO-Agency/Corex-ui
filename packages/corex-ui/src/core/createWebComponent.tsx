import { forwardRef, useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { assignDomProp } from "./assignDomProp";
import { mergeRefs } from "./mergeRefs";
import { useDomEvent } from "./useDomEvent";
import type { CreateWebComponentOptions, DomEventHandler, EventMap } from "./types";

/**
 * Builds a typed React component that renders a given Polaris `s-*` custom
 * element and bridges React conventions onto it:
 *  - `domProps`: values assigned as DOM properties (see `assignDomProp`),
 *    so objects/arrays/booleans behave correctly instead of being stringified.
 *  - `events`: React-style event props (`onClick`) bound as native
 *    `addEventListener` subscriptions to the DOM event Polaris actually fires.
 *  - everything else passes through as a plain JSX prop (HTML attribute).
 *
 * This is the single seam between React and the web-component runtime; every
 * component wrapper in `components/` is built on top of it, either directly
 * (thin wrappers) or by composing several factory-built elements together.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
type NoEvents = {};

function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
}

export function createWebComponent<
  TElement extends HTMLElement,
  TEvents extends EventMap = NoEvents,
>(tagName: string, options: CreateWebComponentOptions<TEvents> = {}) {
  const { domProps = [], events = {} as TEvents, staticAttributes = {} } = options;
  const eventEntries = Object.entries(events) as Array<[string, string]>;

  type EventProps = { [K in keyof TEvents]?: DomEventHandler };
  type Props = Record<string, unknown> &
    EventProps & {
      children?: ReactNode;
    };

  const Component = forwardRef<TElement, Props>(
    function WebComponent(props, forwardedRef) {
      const innerRef = useRef<TElement>(null);
      const { children, ...rest } = props;

      useLayoutEffect(() => {
        const node = innerRef.current;
        if (!node) return;
        for (const [attr, value] of Object.entries(staticAttributes)) {
          node.setAttribute(attr, value);
        }
        // Static attributes never change, so this only needs to run once.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      useLayoutEffect(() => {
        const node = innerRef.current;
        if (!node) return;
        for (const key of domProps) {
          if (key in rest) {
            assignDomProp(node, key, rest[key]);
          }
        }
      });

      // `eventEntries` is fixed per call to `createWebComponent`, so the
      // number/order of hook calls below is stable across renders of any
      // given instance of `Component`.
      // eslint-disable-next-line react-hooks/rules-of-hooks
      for (const [reactEventName, domEventName] of eventEntries) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useDomEvent(
          innerRef,
          domEventName,
          rest[reactEventName] as DomEventHandler | undefined,
        );
      }

      const passthroughProps: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(rest)) {
        if (key in events) continue;
        if (value === undefined) continue;

        if (key === "className") {
          passthroughProps["class"] = value;
          continue;
        }

        // Non-primitive objects/arrays in domProps shouldn't be stringified as attributes
        if (domProps.includes(key) && typeof value === "object" && value !== null) {
          continue;
        }

        // Convert camelCase prop names to kebab-case HTML attributes for custom elements
        if (!key.includes("-") && key !== "style" && /[A-Z]/.test(key)) {
          passthroughProps[toKebabCase(key)] = value;
        }
        passthroughProps[key] = value;
      }

      // The tag name is only known at runtime; type safety for consumers is
      // enforced by the exported `Props` type of each individual component
      // wrapper, not inside this generic factory.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Tag: any = tagName;

      return (
        <Tag {...passthroughProps} ref={mergeRefs(innerRef, forwardedRef)}>
          {children}
        </Tag>
      );
    },
  );

  Component.displayName = `WebComponent(${tagName})`;
  return Component;
}
