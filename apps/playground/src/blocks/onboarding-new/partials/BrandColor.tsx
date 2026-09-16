import { useState, useEffect } from "react";
import type { CSSProperties, Dispatch, SetStateAction } from "react";
import type {
  BrandColorsType,
  OnboardingNewAnswersType,
  StageBrandColorType,
} from "../types";
import { ACCENT, DEFAULT_BRAND_COLORS, styles } from "../constants";

export type BrandColorPropsType = {
  stage: StageBrandColorType;
  answers: OnboardingNewAnswersType;
  setAnswers: Dispatch<SetStateAction<OnboardingNewAnswersType>>;
};

export function BrandColor({ stage, answers, setAnswers }: BrandColorPropsType) {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [popKey, setPopKey] = useState(0);

  const colors = (answers[stage.id] as BrandColorsType) || DEFAULT_BRAND_COLORS;

  useEffect(() => {
    if (!answers[stage.id]) setAnswers((prev) => ({ ...prev, [stage.id]: DEFAULT_BRAND_COLORS }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateColor = (key: keyof BrandColorsType, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [stage.id]: {
        ...((prev[stage.id] as BrandColorsType) || DEFAULT_BRAND_COLORS),
        [key]: value,
        source: "manual",
      },
    }));
  };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      const detected: BrandColorsType = {
        primary: "#1F6F50",
        secondary: "#10241C",
        accent: "#E8B84B",
        background: "#F2F5F1",
      };
      setAnswers((prev) => ({ ...prev, [stage.id]: { ...detected, source: "scan" } }));
      setScanning(false);
      setScanned(true);
      setPopKey((k) => k + 1);
    }, 1500);
  };

  const order: [keyof BrandColorsType, string][] = [
    ["primary", "Primary"],
    ["secondary", "Secondary"],
    ["accent", "Accent"],
    ["background", "Background"],
  ];

  const swatchColorFn = styles.swatchColor as (bg: string) => CSSProperties;
  const brandPreviewFn = styles.brandPreview as (bg: string) => CSSProperties;
  const previewBtnFn = styles.previewBtn as (bg: string) => CSSProperties;
  const previewBadgeFn = styles.previewBadge as (bg: string) => CSSProperties;

  return (
    <>
      <div className="scan-card" style={styles.scanCard as CSSProperties}>
        <div style={styles.scanVisual as CSSProperties}>
          <div style={styles.scanOrbit as CSSProperties} />
          <div style={{ ...(styles.scanOrbit as CSSProperties), animationDelay: "0.6s" }} />
          <svg viewBox="0 0 24 24" fill="none" style={styles.scanStoreIcon as CSSProperties}>
            <path
              d="M3 9.5L4.5 4h15L21 9.5"
              stroke={ACCENT}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M3 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0"
              stroke={ACCENT}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d="M5 9.5V20h14V9.5" stroke={ACCENT} strokeWidth="1.6" />
            <path d="M10 20v-6h4v6" stroke={ACCENT} strokeWidth="1.6" />
          </svg>
        </div>
        <div style={styles.scanCopy as CSSProperties}>
          <div style={styles.scanTitle as CSSProperties}>Scan your store for branding</div>
          <div style={styles.scanDesc as CSSProperties}>
            We'll analyze your storefront and match your colors automatically.
          </div>
        </div>
        <button
          type="button"
          className="scan-cta"
          style={styles.scanCta as CSSProperties}
          disabled={scanning}
          onClick={handleScan}
        >
          {scanning ? (
            <>
              <span style={styles.miniSpinner as CSSProperties} />
              <span>Scanning…</span>
            </>
          ) : (
            <span>{scanned ? "Scan again" : "Scan now"}</span>
          )}
        </button>
      </div>

      <p
        style={{
          ...(styles.scanStatus as CSSProperties),
          ...(scanned ? (styles.scanStatusVisible as CSSProperties) : {}),
        }}
      >
        <span>✓</span>
        <span>Colors updated from your store</span>
      </p>

      <div className="brand-swatches" style={styles.brandSwatches as CSSProperties}>
        {order.map(([key, label]) => (
          <div key={key} style={styles.swatchCard as CSSProperties}>
            <div
              key={`${key}-${popKey}`}
              className={`swatch-color${popKey > 0 ? " is-updated" : ""}`}
              style={swatchColorFn(colors[key] || "#000000")}
            >
              <input
                type="color"
                value={colors[key] || "#000000"}
                onChange={(e) => updateColor(key, e.target.value)}
                style={styles.colorInput as CSSProperties}
              />
              <div style={styles.swatchEdit as CSSProperties}>✎</div>
            </div>
            <span style={styles.swatchLabel as CSSProperties}>{label}</span>
            <span style={styles.swatchHex as CSSProperties}>{colors[key]}</span>
          </div>
        ))}
      </div>

      <div style={brandPreviewFn(colors.background || "#F6F6F7")}>
        <span style={styles.previewCaption as CSSProperties}>Live preview</span>
        <div style={styles.previewChipRow as CSSProperties}>
          <button type="button" style={previewBtnFn(colors.primary || "#008060")}>
            Add to cart
          </button>
          <span style={previewBadgeFn(colors.accent || "#E8B84B")}>Sale</span>
        </div>
      </div>
    </>
  );
}
