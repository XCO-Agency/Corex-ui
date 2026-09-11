import { useCallback } from "react";

export type EventHandler<T = unknown> = (payload: T) => void;

// Shared listeners map across module boundaries and browser contexts
const listeners: Map<string, Set<EventHandler<any>>> =
  typeof globalThis !== "undefined" && (globalThis as any).__corex_event_listeners__
    ? (globalThis as any).__corex_event_listeners__
    : new Map();

if (typeof globalThis !== "undefined" && !(globalThis as any).__corex_event_listeners__) {
  (globalThis as any).__corex_event_listeners__ = listeners;
}

export const eventBus = {
  on<T = unknown>(event: string, handler: EventHandler<T>): () => void {
    if (!listeners.has(event)) {
      listeners.set(event, new Set());
    }

    listeners.get(event)!.add(handler as EventHandler);

    return () => {
      eventBus.off(event, handler);
    };
  },

  off<T = unknown>(event: string, handler?: EventHandler<T>): void {
    if (!handler) {
      listeners.delete(event);
      return;
    }

    listeners.get(event)?.delete(handler as EventHandler);
  },

  emit<T = unknown>(event: string, payload?: T): void {
    listeners.get(event)?.forEach((handler) => {
      handler(payload as T);
    });
  },
};

if (typeof globalThis !== "undefined") {
  (globalThis as any).__corex_event_bus__ = eventBus;
}

export function useEvents() {
  const off = useCallback(
    <T = unknown>(event: string, handler?: EventHandler<T>) => {
      eventBus.off(event, handler);
    },
    []
  );

  const on = useCallback(
    <T = unknown>(event: string, handler: EventHandler<T>) => {
      return eventBus.on(event, handler);
    },
    []
  );

  const emit = useCallback(
    <T = unknown>(event: string, payload?: T) => {
      eventBus.emit(event, payload);
    },
    []
  );

  return {
    emit,
    on,
    off,
  };
}

export type UseEventsResult = ReturnType<typeof useEvents>;
