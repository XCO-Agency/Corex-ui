import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from "react";

/**
 * Maps React-style event prop names (e.g. `onClick`) to the native DOM
 * event name to subscribe to on the underlying custom element (e.g. `click`).
 * The native event name is what actually fires on `s-*` elements; the React
 * prop name is what legacy Polaris React consumers expect to write.
 */
export type EventMap = Record<string, string>;

/** Any handler shape accepted for a bound DOM event. */
export type DomEventHandler = (event: Event) => void;

export interface CreateWebComponentOptions<TEvents extends EventMap> {
  /**
   * Prop names that must be assigned as DOM *properties* (via `el[key] =
   * value`) rather than JSX/HTML attributes, because their values are
   * non-primitive (objects, arrays) or need attribute/property fallback
   * handled uniformly. See `assignDomProp`.
   */
  domProps?: string[];
  /** React event prop name -> native DOM event name, e.g. `{ onClick: "click" }`. */
  events?: TEvents;
  /** Static attributes always applied to every instance (rarely needed). */
  staticAttributes?: Record<string, string>;
}

export interface WebComponentBaseProps {
  children?: ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
}

/** Utility: props of a legacy component minus the ones we intentionally translate. */
export type OmitTranslated<T, K extends keyof T> = Omit<T, K>;

export type PropsOf<T extends ElementType> = ComponentPropsWithoutRef<T>;
