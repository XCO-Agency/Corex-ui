import { forwardRef, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { assignDomProp } from "./assignDomProp";
import { mergeRefs } from "./mergeRefs";
import { useDomEvent } from "./useDomEvent";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import type { CreateWebComponentOptions, DomEventHandler, EventMap } from "./types";

// eslint-disable-next-line @typescript-eslint/ban-types
type NoEvents = {};

/**
 * Props React consumes itself. They must reach React under their exact name
 * and value, never be renamed into an attribute.
 */
const REACT_RESERVED_PROPS = new Set([
  "style",
  "suppressHydrationWarning",
  "dangerouslySetInnerHTML",
]);

/**
 * Attributes whose `"false"` value is meaningful (enumerated, not boolean),
 * so a `false` prop must be written out rather than dropped.
 */
const ENUMERATED_FALSE_ATTRIBUTES = new Set(["spellcheck", "draggable", "contenteditable"]);

/** `onClick`, `onKeyDown`, ...: left for React's own event system. */
const REACT_EVENT_PROP = /^on[A-Z]/;

/**
 * The attribute a prop is written as, or the prop name itself when React has
 * to see it unchanged.
 *
 * Polaris `s-*` elements observe the all-lowercase collapse of each property
 * name (`borderWidth` -> `borderwidth`): the runtime's property reflector
 * derives the attribute as `name.toLowerCase()`, the same name the HTML parser
 * produces for `<s-box borderWidth>`. Kebab-case (`border-width`) is ignored.
 */
function toAttributeName(key: string): string {
  if (key === "className") return "class";
  if (
    REACT_RESERVED_PROPS.has(key) ||
    REACT_EVENT_PROP.test(key) ||
    key.includes("-") ||
    !/[A-Z]/.test(key)
  ) {
    return key;
  }
  return key.toLowerCase();
}

/**
 * Polaris boolean attributes are presence-based: the runtime parses any string
 * value, `"false"` included, as `true`. React 18 stringifies every
 * custom-element prop, so `disabled={false}` would render `disabled="false"`
 * and disable the element, so `false` omits it.
 *
 * `true` stays the boolean `true`, never `""`: the Polaris runtime patches
 * React's props object and assigns every prop the element exposes as a
 * property (`el.disabled = value`), and its boolean setter treats the falsy
 * `""` as `false`. Without the runtime, React writes `disabled="true"`, which
 * the presence-based parser still reads as `true`.
 *
 * Returns `undefined` when the attribute must not be written at all.
 */
function toAttributeValue(name: string, value: unknown): unknown {
  if (typeof value !== "boolean") return value;
  if (name.includes("-") || ENUMERATED_FALSE_ATTRIBUTES.has(name)) return value;
  return value ? true : undefined;
}

const hasOwn = (object: object, key: string) =>
  Object.prototype.hasOwnProperty.call(object, key);

/**
 * Builds a typed React component that renders a given Polaris `s-*` custom
 * element and bridges React conventions onto it:
 *  - `domProps`: values assigned as DOM properties (see `assignDomProp`),
 *    so objects/arrays behave correctly instead of being stringified.
 *    Primitive values are also written as attributes so server-rendered HTML
 *    carries them.
 *  - `events`: React-style event props (`onClick`) bound as native
 *    `addEventListener` subscriptions to the DOM event Polaris actually fires.
 *    Other `on*` props go to React's own event system unchanged.
 *  - `staticAttributes`: always written, and always win over a prop of the
 *    same name.
 *  - everything else is written as an HTML attribute (see `toAttributeName`
 *    and `toAttributeValue`).
 *
 * This is the single seam between React and the web-component runtime; every
 * component wrapper in `components/` is built on top of it, either directly
 * (thin wrappers) or by composing several factory-built elements together.
 */
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
      const mergedRef = useMemo(() => mergeRefs(innerRef, forwardedRef), [forwardedRef]);

      useIsomorphicLayoutEffect(() => {
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
      for (const [reactEventName, domEventName] of eventEntries) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useDomEvent(
          innerRef,
          domEventName,
          rest[reactEventName] as DomEventHandler | undefined,
        );
      }

      const attributes: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(rest)) {
        if (value === undefined || hasOwn(events, key)) continue;

        // Objects/arrays only make sense as the DOM property set above.
        if (domProps.includes(key) && typeof value === "object" && value !== null) {
          continue;
        }

        const name = toAttributeName(key);
        const attributeValue = REACT_RESERVED_PROPS.has(key)
          ? value
          : toAttributeValue(name, value);
        if (attributeValue !== undefined) {
          attributes[name] = attributeValue;
        }
      }

      // The tag name is only known at runtime; type safety for consumers is
      // enforced by the exported `Props` type of each individual component
      // wrapper, not inside this generic factory.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Tag: any = tagName;

      return (
        <Tag {...attributes} {...staticAttributes} ref={mergedRef}>
          {children}
        </Tag>
      );
    },
  );

  Component.displayName = `WebComponent(${tagName})`;
  return Component;
}
