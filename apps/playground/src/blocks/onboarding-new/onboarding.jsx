import React, { useState, useEffect, useCallback } from "react";
import "./onboarding.css";

/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */

const ACCENT = "#008060";
const ACCENT_SOFT = "#E3F1EC";
const BG = "#F6F6F7";
const CARD = "#FFFFFF";
const BORDER = "#E3E3E3";
const BORDER_STRONG = "#C9CCCF";
const TEXT = "#1A1A1A";
const TEXT_SECONDARY = "#6D7175";
const RADIUS = 8;
const SHADOW = "0 2px 4px rgba(0,0,0,.04), 0 14px 34px rgba(0,0,0,.07)";
const FONT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

const DEFAULT_BRAND_COLORS = {
  primary: "#008060",
  secondary: "#1A1A1A",
  accent: "#E8B84B",
  background: "#F6F6F7",
  source: "default",
};

/* Per-preset visual overrides for the cart drawer preview.
   Everything here is a plain style object — no pseudo-classes or
   keyframes needed, so it stays inline rather than in onboarding.css. */
const CART_PRESET_STYLES = {
  minimal: {
    container: {},
    header: { borderBottom: `1px solid ${BORDER}`, paddingBottom: 6 },
    title: {},
    item: {},
    thumb: { borderRadius: 3 },
    price: {},
    qty: {},
    cta: { background: "#fff", color: TEXT, border: `1.4px solid ${TEXT}` },
  },
  bold: {
    container: {},
    header: { background: TEXT, margin: "-10px -10px 6px", padding: "9px 10px" },
    title: { color: "#fff" },
    item: {},
    thumb: {},
    price: { color: ACCENT, fontWeight: 800 },
    qty: {},
    cta: { background: ACCENT },
  },
  rounded: {
    container: { borderRadius: 16 },
    header: {},
    title: {},
    item: { background: "#FAFAFA", borderRadius: 10, padding: "5px 6px", margin: "0 -2px" },
    thumb: { borderRadius: 7 },
    price: {},
    qty: { borderRadius: 99, padding: "1px 6px" },
    cta: { borderRadius: 99, background: ACCENT },
  },
  editorial: {
    container: {},
    header: { borderBottom: `1.4px solid ${TEXT}`, paddingBottom: 6 },
    title: { fontStyle: "italic" },
    item: { borderBottom: `1px dashed ${BORDER}`, paddingBottom: 6 },
    thumb: { borderRadius: 0 },
    price: { fontStyle: "italic" },
    qty: {},
    cta: { background: "#fff", color: TEXT, border: `1.4px solid ${TEXT}`, borderRadius: 0 },
  },
};

/* ------------------------------------------------------------------ */
/* Onboarding flow data                                                */
/* ------------------------------------------------------------------ */

const FLOW = [
  { type: "processing", texts: ["Initializing your workspace…", "Getting things ready…"] },
  {
    type: "questions",
    kind: "choice",
    title: "Tell us about your store",
    questions: [
      {
        id: "volume",
        type: "single",
        question: "What's your average monthly order volume?",
        subtitle: "This helps us tailor performance settings to your store size.",
        options: ["Under 100 orders", "100–500 orders", "500–2,000 orders", "2,000+ orders"],
      },
    ],
  },
  { type: "processing", texts: ["Saving your answer…", "Analyzing your store data…"] },
  {
    type: "questions",
    kind: "toggle-grid",
    id: "addons",
    title: "Add revenue tools to your cart",
    subtitle: "Turn these on now, or add them anytime from your dashboard.",
    options: [
      {
        id: "shipping-protection",
        icon: "📦",
        title: "Shipping protection",
        desc: "Let customers insure their order against loss or damage.",
        default: false,
      },
      {
        id: "warranty",
        icon: "🛡️",
        title: "Product warranty",
        desc: "Offer extended warranty coverage at checkout.",
        default: false,
      },
      {
        id: "gift-wrap",
        icon: "🎁",
        title: "Gift wrapping",
        desc: "Let customers add gift wrap for a small fee.",
        default: false,
      },
      {
        id: "cart-upsells",
        icon: "🛒",
        title: "Cart drawer upsells",
        desc: "Show smart product recommendations in the cart.",
        default: true,
        badge: "Recommended for Journeva",
      },
    ],
  },
  { type: "processing", texts: ["Configuring your revenue tools…", "Applying your preferences…"] },
  {
    type: "questions",
    kind: "style-preset",
    id: "cartStyle",
    title: "Pick a cart drawer style",
    subtitle: "A live preview of how your cart drawer will look — you can fine-tune it later.",
    default: "minimal",
    options: [
      { id: "minimal", label: "Minimal" },
      { id: "bold", label: "Bold" },
      { id: "rounded", label: "Rounded" },
      { id: "editorial", label: "Editorial" },
    ],
  },
  { type: "processing", texts: ["Saving your style…", "Personalizing your storefront…"] },
  {
    type: "questions",
    kind: "brand-color",
    id: "brand",
    title: "Add your brand colors",
    subtitle: "We'll use these across your cart and upsell widgets.",
  },
  { type: "processing", texts: ["Finalizing your setup…", "Wrapping up…"] },
  { type: "complete" },
];

/* ------------------------------------------------------------------ */
/* Style objects                                                       */
/* Everything here is inline-able (no pseudo-classes / keyframes /     */
/* media queries). The handful of things that genuinely can't be       */
/* inline — hover, focus-visible, ::after, @keyframes, @media — live   */
/* in onboarding.css and are hooked in via the classNames below.       */
/* ------------------------------------------------------------------ */

const styles = {
  page: {
    background: `radial-gradient(circle at 50% 0%, rgba(0,128,96,0.07), transparent 55%), ${BG}`,
    color: TEXT,
    fontFamily: FONT,
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "90px 20px 40px",
    position: "relative",
    boxSizing: "border-box",
  },
  bgGrid: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    zIndex: 0,
    backgroundImage: "radial-gradient(rgba(0,0,0,0.035) 1px, transparent 1px)",
    backgroundSize: "26px 26px",
    WebkitMaskImage: "radial-gradient(circle at 50% 25%, black, transparent 68%)",
    maskImage: "radial-gradient(circle at 50% 25%, black, transparent 68%)",
  },
  progressPill: {
    position: "fixed",
    top: 20,
    left: "50%",
    background: "#fff",
    border: `1px solid ${BORDER}`,
    borderRadius: 999,
    boxShadow: SHADOW,
    padding: "10px 18px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    zIndex: 20,
    maxWidth: "92vw",
    transition: "opacity .3s ease, transform .3s ease",
  },
  progressTrack: {
    width: 90,
    height: 4,
    background: BORDER,
    borderRadius: 99,
    overflow: "hidden",
    flexShrink: 0,
  },
  progressFill: {
    height: "100%",
    background: ACCENT,
    borderRadius: 99,
    transition: "width .5s cubic-bezier(.22,1,.36,1)",
  },
  progressLabel: {
    fontSize: ".78rem",
    fontWeight: 600,
    color: TEXT_SECONDARY,
    whiteSpace: "nowrap",
  },

  stageWrap: {
    width: "100%",
    maxWidth: 500,
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  processing: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: "50px 20px",
    textAlign: "center",
    flexWrap: "wrap",
    width: "100%",
  },
  spinner: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    border: `3px solid ${BORDER}`,
    borderTopColor: ACCENT,
    animation: "spin .75s linear infinite",
    flexShrink: 0,
  },
  processingText: {
    fontSize: "clamp(1.25rem, 3.2vw, 1.75rem)",
    fontWeight: 600,
    display: "inline-block",
    backgroundImage: `linear-gradient(90deg, ${TEXT_SECONDARY} 0%, ${TEXT} 22%, ${ACCENT} 42%, ${TEXT} 62%, ${TEXT_SECONDARY} 84%)`,
    backgroundSize: "260% 100%",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    animation: "shimmer 2.4s linear infinite",
    transition: "opacity .3s ease, transform .3s ease",
  },

  panel: {
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    boxShadow: SHADOW,
    maxWidth: 500,
    width: "100%",
    marginBottom: 16,
    boxSizing: "border-box",
  },
  batchTitle: { fontSize: "1.15rem", fontWeight: 700, marginBottom: 6, color: TEXT },
  batchSubtitle: { fontSize: ".85rem", color: TEXT_SECONDARY, margin: "0 0 20px", lineHeight: 1.5 },

  btn: {
    width: "100%",
    maxWidth: 500,
    padding: "13px 20px",
    borderRadius: RADIUS,
    border: "none",
    background: ACCENT,
    color: "#fff",
    fontWeight: 600,
    fontSize: ".95rem",
    cursor: "pointer",
    transition: "background .15s ease, transform .1s ease, box-shadow .15s ease",
  },
  btnDisabled: { background: BORDER, color: TEXT_SECONDARY, cursor: "not-allowed" },

  questionBlock: { marginBottom: 24 },
  qTitle: { fontSize: ".95rem", fontWeight: 600, marginBottom: 4, color: TEXT },
  qSub: { fontSize: ".83rem", color: TEXT_SECONDARY, marginBottom: 12, lineHeight: 1.45 },
  qOptions: { display: "flex", flexDirection: "column", gap: 8 },
  qOption: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: `1px solid ${BORDER}`,
    borderRadius: RADIUS,
    padding: "12px 14px",
    background: "#fff",
    cursor: "pointer",
    textAlign: "left",
    fontSize: ".92rem",
    color: TEXT,
    width: "100%",
    fontFamily: "inherit",
    transition: "border-color .15s ease, background .15s ease",
  },
  qOptionSelected: { borderColor: ACCENT, background: ACCENT_SOFT },
  indicator: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    flexShrink: 0,
    border: `2px solid ${BORDER_STRONG}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "border-color .15s ease, background .15s ease",
  },
  indicatorSquare: { borderRadius: 5 },
  indicatorSelected: { borderColor: ACCENT, background: ACCENT },
  checkIcon: { width: 10, height: 10, transition: "opacity .15s ease, transform .15s ease" },
  checkPath: {
    fill: "none",
    stroke: "#fff",
    strokeWidth: 2.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
  optLabel: { flex: 1 },
  qInputWrap: { display: "flex", alignItems: "center", gap: 8 },
  qInputPrefix: {
    fontSize: ".95rem",
    color: TEXT_SECONDARY,
    border: `1px solid ${BORDER}`,
    borderRight: "none",
    borderRadius: `${RADIUS}px 0 0 ${RADIUS}px`,
    padding: "10px 10px 10px 12px",
    background: "#FAFAFA",
  },
  qInput: {
    fontFamily: FONT,
    fontSize: ".95rem",
    color: TEXT,
    border: `1px solid ${BORDER}`,
    borderLeft: "none",
    borderRadius: `0 ${RADIUS}px ${RADIUS}px 0`,
    padding: "10px 12px",
    width: "100%",
    background: "#fff",
    boxSizing: "border-box",
  },

  /* display:'grid' is inline; grid-template-columns is responsive so it
     lives in onboarding.css under the .toggle-grid / .preset-grid classes */
  toggleGrid: { display: "grid", gap: 12 },
  toggleCard: {
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    position: "relative",
    cursor: "pointer",
    background: "#fff",
    transition: "border-color .15s ease, background .15s ease",
  },
  toggleCardOn: { borderColor: ACCENT, background: ACCENT_SOFT },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    background: ACCENT,
    color: "#fff",
    fontSize: ".6rem",
    fontWeight: 700,
    padding: "3px 8px",
    borderRadius: 99,
    letterSpacing: ".01em",
    maxWidth: 112,
    lineHeight: 1.3,
    textAlign: "right",
  },
  toggleIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: ACCENT_SOFT,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.1rem",
  },
  toggleIconWrapOn: { background: "#fff" },
  toggleTitle: { fontSize: ".92rem", fontWeight: 700, color: TEXT, paddingRight: 56 },
  toggleDesc: { fontSize: ".78rem", color: TEXT_SECONDARY, lineHeight: 1.4, flex: 1 },
  toggleSwitch: {
    alignSelf: "flex-end",
    width: 36,
    height: 20,
    borderRadius: 99,
    background: BORDER_STRONG,
    position: "relative",
    transition: "background .15s ease",
    marginTop: 2,
  },
  toggleSwitchOn: { background: ACCENT },
  hintNote: {
    fontSize: ".78rem",
    color: TEXT_SECONDARY,
    margin: "14px 0 0",
    textAlign: "center",
    lineHeight: 1.4,
  },

  presetGrid: { display: "grid", gap: 12 },
  presetCard: {
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    padding: 10,
    cursor: "pointer",
    textAlign: "center",
    transition: "border-color .15s ease, background .15s ease",
  },
  presetCardSelected: { borderColor: ACCENT, background: ACCENT_SOFT },
  presetLabel: { fontSize: ".8rem", fontWeight: 600, color: TEXT, marginTop: 8 },

  cartPreview: {
    border: `1px solid ${BORDER}`,
    background: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    padding: 10,
    gap: 6,
    height: 176,
    textAlign: "left",
    boxSizing: "border-box",
  },
  cpHeader: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  cpTitle: { fontSize: ".7rem", fontWeight: 700, color: TEXT },
  cpClose: { fontSize: ".75rem", color: TEXT_SECONDARY, lineHeight: 1 },
  cpItem: { display: "flex", alignItems: "center", gap: 7 },
  cpThumb: {
    width: 24,
    height: 24,
    borderRadius: 4,
    background: "linear-gradient(135deg,#DADCDD,#EFEFEF)",
    flexShrink: 0,
  },
  cpInfo: { flex: 1, display: "flex", flexDirection: "column", gap: 3, minWidth: 0 },
  cpName: { height: 5, width: "75%", borderRadius: 2, background: "#DADCDD" },
  cpVariant: { height: 4, width: "48%", borderRadius: 2, background: "#EDEDED" },
  cpRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 3,
    flexShrink: 0,
  },
  cpPrice: { fontSize: ".66rem", fontWeight: 700, color: TEXT },
  cpQty: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    fontSize: ".52rem",
    color: TEXT_SECONDARY,
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    padding: "1px 4px",
  },
  cpFooter: { marginTop: "auto", display: "flex", flexDirection: "column", gap: 6 },
  cpSubtotal: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: ".68rem",
    fontWeight: 700,
    color: TEXT,
  },
  cpCta: {
    textAlign: "center",
    fontSize: ".68rem",
    fontWeight: 700,
    padding: 7,
    borderRadius: 6,
    background: TEXT,
    color: "#fff",
  },

  scanCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 12,
    background: `linear-gradient(135deg, ${ACCENT_SOFT}, #fff 65%)`,
    border: `1px solid ${BORDER}`,
    marginBottom: 22,
  },
  scanVisual: {
    position: "relative",
    width: 44,
    height: 44,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  scanOrbit: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: `2px solid ${ACCENT}`,
    opacity: 0.35,
    animation: "scanPulse 1.8s ease-out infinite",
  },
  scanStoreIcon: { width: 20, height: 20, position: "relative", zIndex: 1 },
  scanCopy: { flex: 1, minWidth: 0 },
  scanTitle: { fontSize: ".9rem", fontWeight: 700, color: TEXT, marginBottom: 2 },
  scanDesc: { fontSize: ".76rem", color: TEXT_SECONDARY, lineHeight: 1.4 },
  scanCta: {
    padding: "9px 16px",
    borderRadius: 8,
    border: "none",
    background: ACCENT,
    color: "#fff",
    fontWeight: 600,
    fontSize: ".82rem",
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: 7,
    transition: "background .15s ease, transform .1s ease",
  },
  miniSpinner: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,.4)",
    borderTopColor: "#fff",
    animation: "spin .7s linear infinite",
  },
  scanStatus: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: ".78rem",
    color: ACCENT,
    fontWeight: 600,
    margin: "-10px 0 18px",
    opacity: 0,
    transform: "translateY(-4px)",
    transition: "opacity .35s ease, transform .35s ease",
  },
  scanStatusVisible: { opacity: 1, transform: "translateY(0)" },

  brandSwatches: { display: "flex", gap: 10, marginBottom: 20 },
  swatchCard: { flex: 1, minWidth: 0, textAlign: "center" },
  swatchColor: (bg) => ({
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: 11,
    cursor: "pointer",
    boxShadow: `0 0 0 1px ${BORDER}`,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    overflow: "hidden",
    background: bg,
    transition: "transform .15s ease, box-shadow .15s ease",
  }),
  colorInput: {
    position: "absolute",
    inset: 0,
    width: "160%",
    height: "160%",
    left: "-30%",
    top: "-30%",
    opacity: 0,
    cursor: "pointer",
    border: "none",
  },
  swatchEdit: {
    position: "relative",
    zIndex: 1,
    margin: 4,
    width: 16,
    height: 16,
    borderRadius: "50%",
    background: "rgba(255,255,255,.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: ".6rem",
    pointerEvents: "none",
  },
  swatchLabel: { display: "block", fontSize: ".68rem", color: TEXT_SECONDARY, marginTop: 6 },
  swatchHex: {
    display: "block",
    fontSize: ".7rem",
    fontWeight: 700,
    color: TEXT,
    fontFamily: "'SF Mono', Menlo, monospace",
  },

  brandPreview: (bg) => ({
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    padding: 16,
    background: bg,
    transition: "background .3s ease",
  }),
  previewCaption: {
    fontSize: ".75rem",
    color: TEXT_SECONDARY,
    fontWeight: 600,
    marginBottom: 10,
    display: "block",
  },
  previewChipRow: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  previewBtn: (bg) => ({
    padding: "9px 18px",
    borderRadius: 8,
    border: "none",
    fontWeight: 700,
    fontSize: ".82rem",
    color: "#fff",
    background: bg,
    transition: "background .3s ease",
  }),
  previewBadge: (bg) => ({
    padding: "4px 10px",
    borderRadius: 99,
    fontSize: ".72rem",
    fontWeight: 700,
    color: "#fff",
    background: bg,
    transition: "background .3s ease",
  }),

  complete: { textAlign: "center", padding: "8px 0" },
  checkWrap: { display: "flex", justifyContent: "center", marginBottom: 18 },
  checkCircle: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: ACCENT_SOFT,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  checkSvg: { width: 26, height: 26 },
  checkPathComplete: {
    fill: "none",
    stroke: ACCENT,
    strokeWidth: 3,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeDasharray: 24,
  },
  completeH2: { fontSize: "1.3rem", fontWeight: 700, marginBottom: 6 },
  completeP: { fontSize: ".9rem", color: TEXT_SECONDARY, margin: 0 },
};

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function CheckIcon({ selected }) {
  return (
    <svg
      style={{
        ...styles.checkIcon,
        opacity: selected ? 1 : 0,
        transform: selected ? "scale(1)" : "scale(.5)",
      }}
      viewBox="0 0 16 16"
    >
      <path d="M3 8.5l3 3 7-7" style={styles.checkPath} />
    </svg>
  );
}

/* Fades + shifts the whole stage in on mount, and out again while
   `leaving` is true (used only for the question -> question handoff). */
function StageTransition({ children, leaving }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(raf1);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: leaving ? 0 : entered ? 1 : 0,
        transform: leaving
          ? "translateY(-14px) scale(.96)"
          : entered
            ? "translateY(0) scale(1)"
            : "translateY(8px) scale(.96)",
        transition: leaving
          ? "opacity .35s ease, transform .35s ease"
          : "opacity .35s cubic-bezier(.22,1,.36,1), transform .35s cubic-bezier(.22,1,.36,1)",
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Processing stage — inline spinner + shimmering, crossfading text    */
/* ------------------------------------------------------------------ */

function ProcessingStage({ texts, onDone }) {
  const [textIndex, setTextIndex] = useState(0);
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    const textTimer = setInterval(() => {
      setChanging(true);
      setTimeout(() => {
        setTextIndex((i) => (i + 1) % texts.length);
        setChanging(false);
      }, 260);
    }, 1300);

    const apiTimer = setTimeout(
      () => {
        onDone();
      },
      1600 + Math.random() * 400
    );

    return () => {
      clearInterval(textTimer);
      clearTimeout(apiTimer);
    };
    // Mount-only: this component is remounted fresh on every stage change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={styles.processing}>
      <div style={styles.spinner} />
      <span
        style={{
          ...styles.processingText,
          opacity: changing ? 0 : 1,
          transform: changing ? "translateY(6px)" : "translateY(0)",
        }}
      >
        {texts[textIndex]}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Question kind: choice list                                          */
/* ------------------------------------------------------------------ */

function ChoiceQuestions({ stage, answers, setAnswers }) {
  return (
    <>
      {stage.questions.map((q) => (
        <div key={q.id} style={styles.questionBlock}>
          <div style={styles.qTitle}>{q.question}</div>
          {q.subtitle && <div style={styles.qSub}>{q.subtitle}</div>}

          {(q.type === "single" || q.type === "multi") && (
            <div style={styles.qOptions} role={q.type === "multi" ? "group" : "radiogroup"}>
              {q.options.map((opt) => {
                const isMulti = q.type === "multi";
                const currentVal = answers[q.id];
                const selected = isMulti
                  ? currentVal instanceof Set && currentVal.has(opt)
                  : currentVal === opt;

                return (
                  <button
                    key={opt}
                    type="button"
                    role={isMulti ? "checkbox" : "radio"}
                    aria-checked={selected}
                    className="q-option"
                    style={{ ...styles.qOption, ...(selected ? styles.qOptionSelected : {}) }}
                    onClick={() => {
                      setAnswers((prev) => {
                        if (isMulti) {
                          const nextSet = new Set(prev[q.id] instanceof Set ? prev[q.id] : []);
                          if (nextSet.has(opt)) nextSet.delete(opt);
                          else nextSet.add(opt);
                          return { ...prev, [q.id]: nextSet };
                        }
                        return { ...prev, [q.id]: opt };
                      });
                    }}
                  >
                    <span
                      style={{
                        ...styles.indicator,
                        ...(isMulti ? styles.indicatorSquare : {}),
                        ...(selected ? styles.indicatorSelected : {}),
                      }}
                    >
                      <CheckIcon selected={selected} />
                    </span>
                    <span style={styles.optLabel}>{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {q.type === "input" && (
            <div style={styles.qInputWrap}>
              <span style={styles.qInputPrefix}>{q.prefix}</span>
              <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder={q.placeholder}
                value={answers[q.id] || ""}
                className="q-input"
                style={styles.qInput}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
              />
            </div>
          )}
        </div>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Question kind: toggle grid (add-ons)                                */
/* ------------------------------------------------------------------ */

function ToggleGrid({ stage, answers, setAnswers }) {
  const selected =
    answers[stage.id] instanceof Set
      ? answers[stage.id]
      : new Set(stage.options.filter((o) => o.default).map((o) => o.id));

  useEffect(() => {
    if (!(answers[stage.id] instanceof Set)) {
      setAnswers((prev) => ({ ...prev, [stage.id]: selected }));
    }
    // Mount-only: seed the default selection once when this stage first renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id) => {
    setAnswers((prev) => {
      const next = new Set(prev[stage.id] instanceof Set ? prev[stage.id] : []);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...prev, [stage.id]: next };
    });
  };

  return (
    <>
      <div className="toggle-grid" style={styles.toggleGrid}>
        {stage.options.map((opt) => {
          const isOn = selected.has(opt.id);
          return (
            <div
              key={opt.id}
              role="switch"
              aria-checked={isOn}
              tabIndex={0}
              style={{ ...styles.toggleCard, ...(isOn ? styles.toggleCardOn : {}) }}
              onClick={() => toggle(opt.id)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggle(opt.id);
                }
              }}
            >
              {opt.badge && <span style={styles.badge}>{opt.badge}</span>}
              <div style={{ ...styles.toggleIconWrap, ...(isOn ? styles.toggleIconWrapOn : {}) }}>
                {opt.icon}
              </div>
              <div style={styles.toggleTitle}>{opt.title}</div>
              <div style={styles.toggleDesc}>{opt.desc}</div>
              <div
                className={`toggle-switch${isOn ? " is-on" : ""}`}
                style={{ ...styles.toggleSwitch, ...(isOn ? styles.toggleSwitchOn : {}) }}
              />
            </div>
          );
        })}
      </div>
      <p style={styles.hintNote}>You can add or remove these anytime from your dashboard.</p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Question kind: cart drawer style presets (real mini cart previews)  */
/* ------------------------------------------------------------------ */

function CartPreview({ presetId }) {
  const p = CART_PRESET_STYLES[presetId];
  const items = [{ price: "$28" }, { price: "$42" }];

  return (
    <div style={{ ...styles.cartPreview, ...p.container }}>
      <div style={{ ...styles.cpHeader, ...p.header }}>
        <span style={{ ...styles.cpTitle, ...p.title }}>Cart (2)</span>
        <span style={{ ...styles.cpClose, ...p.title }}>×</span>
      </div>

      {items.map((item, i) => (
        <div key={i} style={{ ...styles.cpItem, ...p.item }}>
          <div style={{ ...styles.cpThumb, ...p.thumb }} />
          <div style={styles.cpInfo}>
            <div style={styles.cpName} />
            <div style={styles.cpVariant} />
          </div>
          <div style={styles.cpRight}>
            <div style={{ ...styles.cpPrice, ...p.price }}>{item.price}</div>
            <div style={{ ...styles.cpQty, ...p.qty }}>
              <span>−</span>
              <span>1</span>
              <span>+</span>
            </div>
          </div>
        </div>
      ))}

      <div style={styles.cpFooter}>
        <div style={styles.cpSubtotal}>
          <span>Subtotal</span>
          <span>$70</span>
        </div>
        <div style={{ ...styles.cpCta, ...p.cta }}>Checkout</div>
      </div>
    </div>
  );
}

function StylePreset({ stage, answers, setAnswers }) {
  const selected = answers[stage.id] || stage.default;

  useEffect(() => {
    if (!answers[stage.id]) setAnswers((prev) => ({ ...prev, [stage.id]: stage.default }));
    // Mount-only: seed the default preset once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="preset-grid" style={styles.presetGrid}>
      {stage.options.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <div
            key={opt.id}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            style={{ ...styles.presetCard, ...(isSelected ? styles.presetCardSelected : {}) }}
            onClick={() => setAnswers((prev) => ({ ...prev, [stage.id]: opt.id }))}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                setAnswers((prev) => ({ ...prev, [stage.id]: opt.id }));
              }
            }}
          >
            <CartPreview presetId={opt.id} />
            <div style={styles.presetLabel}>{opt.label}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Question kind: brand colors (scan + palette + live preview)         */
/* ------------------------------------------------------------------ */

function BrandColor({ stage, answers, setAnswers }) {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [popKey, setPopKey] = useState(0);

  const colors = answers[stage.id] || DEFAULT_BRAND_COLORS;

  useEffect(() => {
    if (!answers[stage.id]) setAnswers((prev) => ({ ...prev, [stage.id]: DEFAULT_BRAND_COLORS }));
    // Mount-only: seed the default palette once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateColor = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [stage.id]: { ...(prev[stage.id] || DEFAULT_BRAND_COLORS), [key]: value, source: "manual" },
    }));
  };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      const detected = {
        primary: "#1F6F50",
        secondary: "#10241C",
        accent: "#E8B84B",
        background: "#F2F5F1",
      };
      setAnswers((prev) => ({ ...prev, [stage.id]: { ...detected, source: "scan" } }));
      setScanning(false);
      setScanned(true);
      setPopKey((k) => k + 1); // remounts the swatches so the pop animation replays
    }, 1500);
  };

  const order = [
    ["primary", "Primary"],
    ["secondary", "Secondary"],
    ["accent", "Accent"],
    ["background", "Background"],
  ];

  return (
    <>
      <div className="scan-card" style={styles.scanCard}>
        <div style={styles.scanVisual}>
          <div style={styles.scanOrbit} />
          <div style={{ ...styles.scanOrbit, animationDelay: "0.6s" }} />
          <svg viewBox="0 0 24 24" fill="none" style={styles.scanStoreIcon}>
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
        <div style={styles.scanCopy}>
          <div style={styles.scanTitle}>Scan your store for branding</div>
          <div style={styles.scanDesc}>
            We'll analyze your storefront and match your colors automatically.
          </div>
        </div>
        <button
          type="button"
          className="scan-cta"
          style={styles.scanCta}
          disabled={scanning}
          onClick={handleScan}
        >
          {scanning ? (
            <>
              <span style={styles.miniSpinner} />
              <span>Scanning…</span>
            </>
          ) : (
            <span>{scanned ? "Scan again" : "Scan now"}</span>
          )}
        </button>
      </div>

      <p style={{ ...styles.scanStatus, ...(scanned ? styles.scanStatusVisible : {}) }}>
        <span>✓</span>
        <span>Colors updated from your store</span>
      </p>

      <div className="brand-swatches" style={styles.brandSwatches}>
        {order.map(([key, label]) => (
          <div key={key} style={styles.swatchCard}>
            <div
              key={`${key}-${popKey}`}
              className={`swatch-color${popKey > 0 ? " is-updated" : ""}`}
              style={styles.swatchColor(colors[key])}
            >
              <input
                type="color"
                value={colors[key]}
                onChange={(e) => updateColor(key, e.target.value)}
                style={styles.colorInput}
              />
              <div style={styles.swatchEdit}>✎</div>
            </div>
            <span style={styles.swatchLabel}>{label}</span>
            <span style={styles.swatchHex}>{colors[key]}</span>
          </div>
        ))}
      </div>

      <div style={styles.brandPreview(colors.background)}>
        <span style={styles.previewCaption}>Live preview</span>
        <div style={styles.previewChipRow}>
          <button type="button" style={styles.previewBtn(colors.primary)}>
            Add to cart
          </button>
          <span style={styles.previewBadge(colors.accent)}>Sale</span>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Questions stage wrapper (routes to the right kind + Continue button)*/
/* ------------------------------------------------------------------ */

function getStageValidity(stage, answers) {
  if (stage.kind === "choice") {
    return stage.questions.every((q) => {
      const val = answers[q.id];
      if (q.type === "single") return !!val;
      if (q.type === "multi") return val instanceof Set && val.size > 0;
      if (q.type === "input") return !!val && parseFloat(val) > 0;
      return true;
    });
  }
  if (stage.kind === "style-preset") return !!answers[stage.id];
  return true; // toggle-grid and brand-color are always optional
}

function QuestionsStage({ stage, answers, setAnswers, onContinue }) {
  const isValid = getStageValidity(stage, answers);

  return (
    <>
      <div className="panel" style={styles.panel}>
        {stage.kind !== "choice" && (
          <>
            <h3 style={styles.batchTitle}>{stage.title}</h3>
            {stage.subtitle && <p style={styles.batchSubtitle}>{stage.subtitle}</p>}
          </>
        )}

        {stage.kind === "choice" && (
          <ChoiceQuestions stage={stage} answers={answers} setAnswers={setAnswers} />
        )}
        {stage.kind === "toggle-grid" && (
          <ToggleGrid stage={stage} answers={answers} setAnswers={setAnswers} />
        )}
        {stage.kind === "style-preset" && (
          <StylePreset stage={stage} answers={answers} setAnswers={setAnswers} />
        )}
        {stage.kind === "brand-color" && (
          <BrandColor stage={stage} answers={answers} setAnswers={setAnswers} />
        )}
      </div>

      <button
        type="button"
        className="btn"
        style={{ ...styles.btn, ...(isValid ? {} : styles.btnDisabled) }}
        disabled={!isValid}
        onClick={onContinue}
      >
        Continue
      </button>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Complete stage                                                       */
/* ------------------------------------------------------------------ */

function CompleteStage({ onRestart }) {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setDrawn(true)));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <div className="panel" style={styles.panel}>
        <div style={styles.complete}>
          <div style={styles.checkWrap}>
            <div style={styles.checkCircle}>
              <svg viewBox="0 0 24 24" style={styles.checkSvg}>
                <path
                  d="M4 12l6 6 10-12"
                  style={{
                    ...styles.checkPathComplete,
                    strokeDashoffset: drawn ? 0 : 24,
                    transition: "stroke-dashoffset .5s ease .2s",
                  }}
                />
              </svg>
            </div>
          </div>
          <h2 style={styles.completeH2}>You're all set</h2>
          <p style={styles.completeP}>Your revenue tools are configured and ready to go.</p>
        </div>
      </div>
      <button type="button" className="btn" style={styles.btn} onClick={onRestart}>
        Enter dashboard
      </button>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Top-level flow                                                       */
/* ------------------------------------------------------------------ */

export default function OnboardingFlow() {
  const [stageIndex, setStageIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questionStagesDone, setQuestionStagesDone] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const currentStage = FLOW[stageIndex];
  const totalQuestionStages = FLOW.filter((s) => s.type === "questions").length;

  const advance = useCallback(() => setStageIndex((i) => i + 1), []);

  const handleContinue = () => {
    setLeaving(true);
    setTimeout(() => {
      setQuestionStagesDone((d) => d + 1);
      setStageIndex((i) => i + 1);
      setLeaving(false);
    }, 400);
  };

  const handleRestart = () => {
    setAnswers({});
    setQuestionStagesDone(0);
    setStageIndex(0);
  };

  const progressPct = (questionStagesDone / totalQuestionStages) * 100;
  const shownStep = Math.min(questionStagesDone + 1, totalQuestionStages);
  const showProgress = currentStage.type !== "complete";

  return (
    <div style={styles.page}>
      <div style={styles.bgGrid} />

      <div
        style={{
          ...styles.progressPill,
          opacity: showProgress ? 1 : 0,
          transform: showProgress ? "translate(-50%, 0)" : "translate(-50%, -14px)",
          pointerEvents: showProgress ? "auto" : "none",
        }}
      >
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${progressPct}%` }} />
        </div>
        <span style={styles.progressLabel}>
          Step {shownStep} of {totalQuestionStages}
        </span>
      </div>

      <div style={styles.stageWrap}>
        <StageTransition key={stageIndex} leaving={leaving}>
          {currentStage.type === "processing" && (
            <ProcessingStage texts={currentStage.texts} onDone={advance} />
          )}
          {currentStage.type === "questions" && (
            <QuestionsStage
              stage={currentStage}
              answers={answers}
              setAnswers={setAnswers}
              onContinue={handleContinue}
            />
          )}
          {currentStage.type === "complete" && <CompleteStage onRestart={handleRestart} />}
        </StageTransition>
      </div>
    </div>
  );
}
