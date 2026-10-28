import * as React from "react";
import {
  Autocomplete,
  Banner,
  BlockStack,
  Box,
  Button,
  Card,
  Clickable,
  Divider,
  Icon,
  InlineStack,
  Link,
  PasswordField,
  Spinner,
  Tag,
  Text,
  TextField,
  Tooltip,
} from "@xco-agency/corex-ui";
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
  const query = model.trim().toLowerCase();
  const models =
    !query || MODEL_SUGGESTIONS.includes(model)
      ? MODEL_SUGGESTIONS
      : MODEL_SUGGESTIONS.filter((name) => name.includes(query));

  return (
    <Card heading="Gemini connection" icon="key">
      <BlockStack gap="base">
        <PasswordField
          label="API key"
          placeholder="AIza…"
          value={apiKey}
          onChange={(next) => setApiKey(next)}
        />
        <BlockStack gap="small-300">
          <Text variant="small" fontWeight="medium">
            Model
          </Text>
          <Autocomplete
            value={model}
            selected={MODEL_SUGGESTIONS.includes(model) ? model : undefined}
            placeholder={DEFAULT_MODEL}
            options={models.map((name) => ({ value: name }))}
            onChange={(next) => setModel(next)}
            onSelect={(next) => setModel(next)}
          />
        </BlockStack>
        <Text variant="small" color="subdued">
          Stored in this browser only and sent straight to Google. Get a key from{" "}
          <Link href="https://aistudio.google.com/apikey" target="_blank">
            Google AI Studio
          </Link>
          .
        </Text>
        <InlineStack gap="small-200" justifyContent="end">
          {onCancel && <Button onClick={onCancel}>Cancel</Button>}
          <Button
            variant="primary"
            disabled={!apiKey.trim()}
            onClick={() =>
              onSave({ apiKey: apiKey.trim(), model: model.trim() || DEFAULT_MODEL })
            }
          >
            Save
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}

export function AiPanel() {
  const { state, dispatch, selected } = useEditor();
  const [settings, setSettings] = React.useState(loadSettings);
  const [editingSettings, setEditingSettings] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessageType[]>([]);
  const [prompt, setPrompt] = React.useState("");
  /**
   * `s-text-area` keeps its typed text when `value` is reset to "" (its value
   * property never left ""), so the composer remounts after each send to clear.
   */
  const [composerKey, setComposerKey] = React.useState(0);
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
    setComposerKey((key) => key + 1);
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
      <BlockStack grow minBlockSize={0} overflowY="auto">
        <Box padding="base">
          <BlockStack gap="base">
            {!settings.apiKey && (
              <BlockStack gap="small-200">
                <Icon type="wand" tone="info" />
                <Text fontWeight="semibold">Build with the AI agent</Text>
                <Text variant="small" color="subdued">
                  Describe a page or a change and the agent composes it from Corex UI
                  components and blocks. Connect a Gemini API key to start.
                </Text>
              </BlockStack>
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
          </BlockStack>
        </Box>
      </BlockStack>
    );
  }

  return (
    <BlockStack grow minBlockSize={0}>
      <BlockStack ref={scrollRef} grow minBlockSize={0} overflowY="auto">
        <Box padding="base">
          <BlockStack gap="base">
            {!messages.length && (
              <BlockStack gap="base">
                <BlockStack gap="small-200">
                  <Icon type="wand" tone="info" />
                  <Text fontWeight="semibold">What should we build?</Text>
                  <Text variant="small" color="subdued">
                    The agent edits the canvas directly. Select an element first to change
                    just that part.
                  </Text>
                </BlockStack>
                <BlockStack gap="small-200">
                  {SUGGESTIONS.map((suggestion) => (
                    <Clickable
                      key={suggestion}
                      padding="small"
                      border="base"
                      borderRadius="base"
                      accessibilityLabel={suggestion}
                      onClick={() => send(suggestion)}
                    >
                      <Text variant="small" color="subdued">
                        {suggestion}
                      </Text>
                    </Clickable>
                  ))}
                </BlockStack>
              </BlockStack>
            )}

            {messages.map((message) =>
              message.role === "user" ? (
                <InlineStack key={message.id} justifyContent="end">
                  <Box
                    background="strong"
                    padding="small"
                    borderRadius="large-100"
                    maxInlineSize="85%"
                  >
                    <Text>{message.text}</Text>
                  </Box>
                </InlineStack>
              ) : (
                <BlockStack key={message.id} gap="small-200">
                  {message.error ? (
                    <Banner tone="critical">{message.text}</Banner>
                  ) : (
                    <Box
                      background="subdued"
                      padding="small"
                      borderRadius="large-100"
                      maxInlineSize="90%"
                    >
                      <Text>{message.text}</Text>
                    </Box>
                  )}
                  {message.retry && message.id === lastAssistantId && !busy && (
                    <InlineStack>
                      <Button
                        icon="refresh"
                        onClick={() => {
                          const next = { ...settings, model: message.retry!.model };
                          saveSettings(next);
                          setSettings(next);
                          send(message.retry!.prompt, next);
                        }}
                      >
                        {`Switch to ${message.retry.model} and retry`}
                      </Button>
                    </InlineStack>
                  )}
                  {Boolean(message.applied) && (
                    <InlineStack gap="small-200" alignItems="center">
                      <Text variant="small" color="subdued">
                        {`Applied ${message.applied} change${message.applied === 1 ? "" : "s"}`}
                      </Text>
                      {message.id === lastAssistantId &&
                        snapshots.current.has(message.id) && (
                          <Button
                            variant="tertiary"
                            icon="undo"
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
                            Revert
                          </Button>
                        )}
                    </InlineStack>
                  )}
                </BlockStack>
              ),
            )}
            {busy && (
              <InlineStack gap="small-200" alignItems="center">
                <Spinner size="small" accessibilityLabel="Composing" />
                <Text variant="small" color="subdued">
                  Composing…
                </Text>
              </InlineStack>
            )}
          </BlockStack>
        </Box>
      </BlockStack>

      <Divider />
      {/* Enter sends, Shift+Enter adds a line; the key event bubbles out of the text area. */}
      <BlockStack
        gap="small"
        padding="base"
        shrink={false}
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
      >
        {selectedLabel && (
          <InlineStack>
            <Tag onRemove={() => dispatch({ type: "select", id: null })}>
              {`Editing: ${selectedLabel}`}
            </Tag>
          </InlineStack>
        )}
        <TextField
          key={composerKey}
          label="Prompt"
          labelAccessibilityVisibility="exclusive"
          multiline={3}
          value={prompt}
          placeholder={
            selectedLabel
              ? `Change the selected ${selectedLabel.toLowerCase()}…`
              : "Describe a page or a change…"
          }
          onChange={(next) => setPrompt(next)}
        />
        <InlineStack justifyContent="space-between" alignItems="center">
          <Tooltip content="Gemini connection">
            <Button
              variant="tertiary"
              icon="settings"
              onClick={() => setEditingSettings(true)}
            >
              {settings.model}
            </Button>
          </Tooltip>
          {busy ? (
            <Tooltip content="Stop">
              <Button
                icon="stop-circle"
                accessibilityLabel="Stop"
                onClick={() => abortRef.current?.abort()}
              />
            </Tooltip>
          ) : (
            <Tooltip content="Send (Enter)">
              <Button
                variant="primary"
                icon="send"
                accessibilityLabel="Send"
                disabled={!prompt.trim()}
                onClick={() => send(prompt)}
              />
            </Tooltip>
          )}
        </InlineStack>
      </BlockStack>
    </BlockStack>
  );
}
