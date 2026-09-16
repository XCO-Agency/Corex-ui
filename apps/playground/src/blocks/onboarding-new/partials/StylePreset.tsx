import { useEffect } from "react";
import type { CSSProperties, Dispatch, SetStateAction } from "react";
import type {
  CartPresetIdType,
  OnboardingNewAnswersType,
  StageStylePresetType,
} from "../types";
import { CART_PRESET_STYLES, styles } from "../constants";

export type CartPreviewPropsType = {
  presetId: CartPresetIdType;
};

export function CartPreview({ presetId }: CartPreviewPropsType) {
  const p = CART_PRESET_STYLES[presetId] || CART_PRESET_STYLES.minimal;
  const items = [{ price: "$28" }, { price: "$42" }];

  return (
    <div style={{ ...(styles.cartPreview as CSSProperties), ...(p.container as CSSProperties) }}>
      <div style={{ ...(styles.cpHeader as CSSProperties), ...(p.header as CSSProperties) }}>
        <span style={{ ...(styles.cpTitle as CSSProperties), ...(p.title as CSSProperties) }}>Cart (2)</span>
        <span style={{ ...(styles.cpClose as CSSProperties), ...(p.title as CSSProperties) }}>×</span>
      </div>

      {items.map((item, i) => (
        <div key={i} style={{ ...(styles.cpItem as CSSProperties), ...(p.item as CSSProperties) }}>
          <div style={{ ...(styles.cpThumb as CSSProperties), ...(p.thumb as CSSProperties) }} />
          <div style={styles.cpInfo as CSSProperties}>
            <div style={styles.cpName as CSSProperties} />
            <div style={styles.cpVariant as CSSProperties} />
          </div>
          <div style={styles.cpRight as CSSProperties}>
            <div style={{ ...(styles.cpPrice as CSSProperties), ...(p.price as CSSProperties) }}>{item.price}</div>
            <div style={{ ...(styles.cpQty as CSSProperties), ...(p.qty as CSSProperties) }}>
              <span>−</span>
              <span>1</span>
              <span>+</span>
            </div>
          </div>
        </div>
      ))}

      <div style={styles.cpFooter as CSSProperties}>
        <div style={styles.cpSubtotal as CSSProperties}>
          <span>Subtotal</span>
          <span>$70</span>
        </div>
        <div style={{ ...(styles.cpCta as CSSProperties), ...(p.cta as CSSProperties) }}>Checkout</div>
      </div>
    </div>
  );
}

export type StylePresetPropsType = {
  stage: StageStylePresetType;
  answers: OnboardingNewAnswersType;
  setAnswers: Dispatch<SetStateAction<OnboardingNewAnswersType>>;
};

export function StylePreset({ stage, answers, setAnswers }: StylePresetPropsType) {
  const selected = (answers[stage.id] as CartPresetIdType) || stage.default;

  useEffect(() => {
    if (!answers[stage.id]) setAnswers((prev) => ({ ...prev, [stage.id]: stage.default }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="preset-grid" style={styles.presetGrid as CSSProperties}>
      {stage.options.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <div
            key={opt.id}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            style={{
              ...(styles.presetCard as CSSProperties),
              ...(isSelected ? (styles.presetCardSelected as CSSProperties) : {}),
            }}
            onClick={() => setAnswers((prev) => ({ ...prev, [stage.id]: opt.id }))}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                setAnswers((prev) => ({ ...prev, [stage.id]: opt.id }));
              }
            }}
          >
            <CartPreview presetId={opt.id} />
            <div style={styles.presetLabel as CSSProperties}>{opt.label}</div>
          </div>
        );
      })}
    </div>
  );
}
