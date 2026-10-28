import * as React from "react";
import {
  ArrowUp,
  KeyRound,
  Loader2,
  RotateCcw,
  Settings2,
  Sparkles,
  Square,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { applyAgentResponse, buildUserTurn, SYSTEM_PROMPT } from "../ai/agent";
import {
  DEFAULT_MODEL,
  generateJson,
  loadSettings,
  MODEL_SUGGESTIONS,
  saveSettings,
  replacementModel,
  type GeminiSettingsType,
  type GeminiTurnType,
} from "../ai/gemini";
import { getDefinition } from "../definitions";
import { useEditor } from "../store";
import { createId } from "../tree";
import type { ChatMessageType, EditorNodeType } from "../types";

const SUGGESTIONS = [
  "Build an analytics dashboard with 4 KPIs and a recent orders card",
  "Create a settings page for a shipping app with notification toggles",
  "Add an onboarding banner at the top with a call to action",
  "Make the selected card more compact and add a badge",
];

/** Earlier turns sent with each request, so follow-ups like "make it bigger" work. */
const HISTORY_TURNS = 8;

function SettingsForm({
  settings,
  onSave,
  onCancel,
}: {
  settings: GeminiSettingsType;
  onSave: (settings: GeminiSettingsType) => void;
  onCancel?: () => void;
}) {
  const [apiKey, setApiKey] = React.useState(settings.apiKey);
  const [model, setModel] = React.useState(settings.model);

  return (
    <form
      className="flex flex-col gap-3 rounded-xl border border-border/80 bg-muted/30 p-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({ apiKey: apiKey.trim(), model: model.trim() || DEFAULT_MODEL });
      }}
    >
      <div className="flex items-center gap-2">
        <KeyRound className="size-3.5 text-muted-foreground" />
        <p className="flex-1 text-xs font-semibold">Gemini connection</p>
        {onCancel && (
          <Button type="button" variant="ghost" size="icon-xs" onClick={onCancel}>
            <X />
          </Button>
        )}
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-medium text-muted-foreground">API key</span>
        <Input
          type="password"
          autoComplete="off"
          className="h-8 font-mono text-xs"
          placeholder="AIza…"
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-medium text-muted-foreground">Model</span>
        <Input
          list="cx-gemini-models"
          className="h-8 font-mono text-xs"
          value={model}
          onChange={(event) => setModel(event.target.value)}
        />
        <datalist id="cx-gemini-models">
          {MODEL_SUGGESTIONS.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </label>
      <p className="text-[11px] leading-snug text-muted-foreground">
        Stored in this browser only and sent straight to Google. Get a key from{" "}
        <a
          className="underline underline-offset-2"
          href="https://aistudio.google.com/apikey"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google AI Studio
        </a>
        .
      </p>
      <Button type="submit" size="sm" disabled={!apiKey.trim()}>
        Save
      </Button>
    </form>
  );
}

export function AiPanel() {
  const { state, dispatch, selected } = useEditor();
  const [settings, setSettings] = React.useState(loadSettings);
  const [editingSettings, setEditingSettings] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessageType[]>([]);
  const [prompt, setPrompt] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const snapshots = React.useRef(new Map<string, EditorNodeType>());
  const abortRef = React.useRef<AbortController | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const rootRef = React.useRef(state.root);
  rootRef.current = state.root;

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, busy]);

  const lastAssistantId = [...messages]
    .reverse()
    .find((message) => message.role === "assistant")?.id;
  const selectedLabel = selected
    ? (getDefinition(selected.type)?.label ?? selected.type)
    : null;

  const send = async (text: string, active: GeminiSettingsType = settings) => {
    const request = text.trim();
    if (!request || busy || !active.apiKey) return;

    // Failed exchanges (the prompt and its error) are left out of the history.
    const history: GeminiTurnType[] = messages
      .filter((message, index) => !message.error && !messages[index + 1]?.error)
      .slice(-HISTORY_TURNS)
      .map((message) => ({
        role: message.role === "user" ? "user" : "model",
        text: message.text,
      }));

    setMessages((current) => [
      ...current,
      { id: createId(), role: "user", text: request },
    ]);
    setPrompt("");
    setBusy(true);
    const controller = new AbortController();
    abortRef.current = controller;
    const before = rootRef.current;

    try {
      const raw = await generateJson({
        settings: active,
        system: SYSTEM_PROMPT,
        turns: [
          ...history,
          { role: "user", text: buildUserTurn(before, state.selectedId, request) },
        ],
        signal: controller.signal,
      });
      const result = applyAgentResponse(raw, rootRef.current);
      const id = createId();
      if (result.applied) {
        snapshots.current.set(id, before);
        dispatch({ type: "replace", root: result.root, selectedId: result.focusId });
      }
      setMessages((current) => [
        ...current,
        {
          id,
          role: "assistant",
          text:
            result.skipped && !result.applied
              ? `${result.message} (No changes could be applied.)`
              : result.message,
          applied: result.applied,
        },
      ]);
    } catch (error) {
      const aborted = controller.signal.aborted;
      const next =
        !aborted && error instanceof Error
          ? replacementModel(error.message, active.model)
          : null;
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          ...(next ? { retry: { model: next, prompt: request } } : {}),
          text: aborted
            ? "Stopped."
            : error instanceof SyntaxError
              ? "The model replied with invalid JSON. Try again or rephrase."
              : error instanceof Error
                ? error.message
                : "Something went wrong.",
          error: !aborted,
        },
      ]);
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  };

  if (!settings.apiKey || editingSettings) {
    return (
      <div className="flex-1 overflow-y-auto p-3">
        {!settings.apiKey && (
          <div className="mb-3 flex flex-col gap-1.5 px-1 pt-1">
            <Sparkles className="size-5 text-violet-600" />
            <p className="text-sm font-semibold">Build with the AI agent</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Describe a page or a change and the agent composes it from Corex UI
              components and blocks. Connect a Gemini API key to start.
            </p>
          </div>
        )}
        <SettingsForm
          settings={settings}
          onCancel={settings.apiKey ? () => setEditingSettings(false) : undefined}
          onSave={(next) => {
            saveSettings(next);
            setSettings(next);
            setEditingSettings(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3">
        {!messages.length && (
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex flex-col gap-1 px-1">
              <Sparkles className="size-5 text-violet-600" />
              <p className="text-sm font-semibold">What should we build?</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                The agent edits the canvas directly. Select an element first to change
                just that part.
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => send(suggestion)}
                  className="cursor-pointer rounded-lg border border-border/70 bg-background px-3 py-2 text-left text-xs leading-snug text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {messages.map((message) =>
            message.role === "user" ? (
              <div
                key={message.id}
                className="ml-6 self-end rounded-2xl rounded-br-md bg-foreground px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap text-background"
              >
                {message.text}
              </div>
            ) : (
              <div key={message.id} className="mr-4 flex flex-col gap-1.5">
                <div
                  className={cn(
                    "rounded-2xl rounded-bl-md px-3 py-2 text-xs leading-relaxed",
                    message.error
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted text-foreground",
                  )}
                >
                  {message.text}
                </div>
                {message.retry && message.id === lastAssistantId && !busy && (
                  <button
                    type="button"
                    className="flex cursor-pointer items-center gap-1 self-start rounded-md border border-border bg-background px-2 py-1 text-[11px] font-medium hover:bg-muted"
                    onClick={() => {
                      const next = { ...settings, model: message.retry!.model };
                      saveSettings(next);
                      setSettings(next);
                      send(message.retry!.prompt, next);
                    }}
                  >
                    <RotateCcw className="size-3" />
                    Switch to {message.retry.model} and retry
                  </button>
                )}
                {Boolean(message.applied) && (
                  <div className="flex items-center gap-2 px-1 text-[11px] text-muted-foreground">
                    <span>
                      Applied {message.applied} change{message.applied === 1 ? "" : "s"}
                    </span>
                    {message.id === lastAssistantId &&
                      snapshots.current.has(message.id) && (
                        <button
                          type="button"
                          className="flex cursor-pointer items-center gap-1 font-medium hover:text-foreground"
                          onClick={() => {
                            dispatch({
                              type: "replace",
                              root: snapshots.current.get(message.id)!,
                              selectedId: null,
                            });
                            snapshots.current.delete(message.id);
                            setMessages((current) => [...current]);
                          }}
                        >
                          <RotateCcw className="size-3" />
                          Revert
                        </button>
                      )}
                  </div>
                )}
              </div>
            ),
          )}
          {busy && (
            <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Composing…
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border/70 p-3">
        <div className="rounded-xl border border-border bg-background shadow-xs focus-within:border-foreground/30 focus-within:ring-2 focus-within:ring-ring/20">
          {selectedLabel && (
            <div className="flex items-center gap-1.5 px-3 pt-2">
              <span className="flex items-center gap-1 rounded-md bg-blue-600/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-300">
                Editing: {selectedLabel}
                <button
                  type="button"
                  className="cursor-pointer opacity-70 hover:opacity-100"
                  onClick={() => dispatch({ type: "select", id: null })}
                  aria-label="Clear selection"
                >
                  <X className="size-3" />
                </button>
              </span>
            </div>
          )}
          <textarea
            value={prompt}
            rows={3}
            placeholder={
              selectedLabel
                ? `Change the selected ${selectedLabel.toLowerCase()}…`
                : "Describe a page or a change…"
            }
            className="block w-full resize-none bg-transparent px-3 pt-2 text-xs leading-relaxed outline-none placeholder:text-muted-foreground"
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                send(prompt);
              }
            }}
          />
          <div className="flex items-center justify-between px-2 pb-2">
            <button
              type="button"
              onClick={() => setEditingSettings(true)}
              className="flex h-6 cursor-pointer items-center gap-1 rounded-md px-1.5 font-mono text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Settings2 className="size-3" />
              {settings.model}
            </button>
            {busy ? (
              <Button
                size="icon-xs"
                variant="secondary"
                onClick={() => abortRef.current?.abort()}
                title="Stop"
              >
                <Square className="fill-current" />
              </Button>
            ) : (
              <Button
                size="icon-xs"
                disabled={!prompt.trim()}
                onClick={() => send(prompt)}
                title="Send (Enter)"
              >
                <ArrowUp />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
