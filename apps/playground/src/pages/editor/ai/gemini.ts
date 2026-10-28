const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

export const DEFAULT_MODEL = "gemini-3.8-flash";
export const MODEL_SUGGESTIONS = [
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
  "gemini-4-argon",
];

/**
 * 2.x models are shut down or limited to keys that already used them, and the
 * first editor version suggested them, so a saved 2.x choice falls back to the default.
 */
const RETIRED_MODEL = /^gemini-2\./;

const KEY_STORAGE = "corex-editor:gemini-key";
const MODEL_STORAGE = "corex-editor:gemini-model";

export type GeminiTurnType = { role: "user" | "model"; text: string };

export type GeminiSettingsType = { apiKey: string; model: string };

function read(key: string) {
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function write(key: string, value: string) {
  try {
    if (value) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
  } catch {
    // Without storage the key only lives for this session.
  }
}

/**
 * The key is kept in this browser only. `VITE_GEMINI_API_KEY` in
 * `apps/playground/.env.local` is a local-dev fallback; never set it for a
 * deployed build, since Vite inlines it into the public bundle.
 */
export function loadSettings(): GeminiSettingsType {
  const envKey = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) ?? "";
  return {
    apiKey: read(KEY_STORAGE) || envKey,
    model: RETIRED_MODEL.test(read(MODEL_STORAGE))
      ? DEFAULT_MODEL
      : read(MODEL_STORAGE) || DEFAULT_MODEL,
  };
}

export function saveSettings({ apiKey, model }: GeminiSettingsType) {
  write(KEY_STORAGE, apiKey.trim());
  write(MODEL_STORAGE, model.trim() === DEFAULT_MODEL ? "" : model.trim());
}

/**
 * When Google retires a model it answers "…is no longer available… use
 * models/gemini-x for…". Returns the model it recommends (or our default), or
 * `null` for other errors.
 */
export function replacementModel(errorMessage: string, current: string): string | null {
  if (
    !/no longer available|is not found|not supported for generateContent/i.test(
      errorMessage,
    )
  ) {
    return null;
  }
  const suggested = errorMessage.match(/use models\/(gemini-[\w.-]*[\w-])/i)?.[1];
  const next = suggested ?? DEFAULT_MODEL;
  return next === current ? null : next;
}

type GeminiResponseType = {
  candidates?: {
    content?: { parts?: { text?: string; thought?: boolean }[] };
    finishReason?: string;
  }[];
  promptFeedback?: { blockReason?: string };
  error?: { message?: string };
};

export async function generateJson({
  settings,
  system,
  turns,
  signal,
}: {
  settings: GeminiSettingsType;
  system: string;
  turns: GeminiTurnType[];
  signal?: AbortSignal;
}): Promise<string> {
  const response = await fetch(
    `${ENDPOINT}/${encodeURIComponent(settings.model || DEFAULT_MODEL)}:generateContent`,
    {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json", "x-goog-api-key": settings.apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: turns.map(({ role, text }) => ({ role, parts: [{ text }] })),
        generationConfig: { responseMimeType: "application/json", temperature: 0.4 },
      }),
    },
  );

  const data = (await response.json().catch(() => ({}))) as GeminiResponseType;
  if (!response.ok) {
    throw new Error(data.error?.message ?? `Gemini request failed (${response.status})`);
  }
  if (data.promptFeedback?.blockReason) {
    throw new Error(`Gemini blocked the prompt (${data.promptFeedback.blockReason}).`);
  }
  const text = (data.candidates?.[0]?.content?.parts ?? [])
    .filter((part) => !part.thought && part.text)
    .map((part) => part.text)
    .join("");
  if (!text) {
    throw new Error(
      `Gemini returned no content${data.candidates?.[0]?.finishReason ? ` (${data.candidates[0].finishReason})` : ""}.`,
    );
  }
  return text;
}
