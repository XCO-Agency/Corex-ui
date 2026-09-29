import type { BrandColorsType, CartPresetIdType } from "../types";
import styles from "../cart-variants.module.css";

export interface CartDrawerContentPropsType {
  preset: CartPresetIdType;
  brand: BrandColorsType;
  currency?: string;
  interactive?: boolean;
  onClose?: () => void;
}

export function CartDrawerContent({
  preset,
  brand,
  onClose,
}: CartDrawerContentPropsType) {
  const isBold = preset === "bold";
  const resolvedBg = isBold
    ? "#111215"
    : preset === "editorial"
      ? "#fbf9f6"
      : preset === "minimal"
        ? "#ffffff"
        : brand.background || "#ffffff";

  const resolvedText = isBold ? "#ffffff" : brand.secondary || "#1a1a1a";
  const resolvedPrimary = isBold
    ? "#008060"
    : brand.primary || (preset === "editorial" ? "#111215" : "#008060");
  const resolvedAccent = brand.accent || "#e8b84b";
  const resolvedSurface = isBold
    ? "#1c1e24"
    : preset === "editorial"
      ? "#f2eee9"
      : "#f6f6f7";

  return (
    <div
      className={`${styles.cartDrawer} ${styles[`preset-${preset}`]}`}
      style={
        {
          "--cart-primary": resolvedPrimary,
          "--cart-secondary": resolvedText,
          "--cart-accent": resolvedAccent,
          "--cart-bg": resolvedBg,
          "--cart-surface": resolvedSurface,
        } as React.CSSProperties
      }
    >
      {/* 1. Contextual Announcement Banner Placeholder */}
      <div className={styles.drawerBanner}>
        <div
          className={styles.placeholderBar}
          style={{ width: "65%", margin: "0 auto", opacity: 0.35, height: 7 }}
        />
      </div>

      {/* 2. Header Placeholder */}
      <header className={styles.drawerHeader}>
        <div className={styles.drawerHeaderLeft}>
          <div
            className={styles.placeholderBar}
            style={{ width: 44, height: 6, opacity: 0.25, marginBottom: 4 }}
          />
          <div
            className={styles.placeholderBar}
            style={{ width: 85, height: 13, opacity: 0.6 }}
          />
        </div>

        <div className={styles.drawerHeaderRight}>
          <span className={styles.drawerCount}>2</span>
          {onClose && (
            <button
              type="button"
              className={styles.drawerCloseBtn}
              onClick={onClose}
              aria-label="Close cart drawer"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* 3. Free Shipping Tier Progress Bar Placeholder */}
      <div className={styles.drawerShippingBar}>
        <div
          className={styles.placeholderBar}
          style={{ width: "70%", height: 7, marginBottom: 8, opacity: 0.35 }}
        />
        <div className={styles.drawerShippingTrack}>
          <div
            className={styles.drawerShippingFill}
            style={{ width: "68%" }}
          />
        </div>
      </div>

      {/* 4. Cart Items Placeholders (Pure Wireframe) */}
      <main className={styles.drawerItems}>
        {[1, 2].map((idx) => (
          <div className={styles.drawerItem} key={idx}>
            <div className={styles.placeholderThumb} />

            <div className={styles.drawerItemDetails}>
              <div className={styles.drawerItemTop}>
                <div style={{ flex: 1 }}>
                  <div
                    className={styles.placeholderBar}
                    style={{
                      width: idx === 1 ? "80%" : "65%",
                      height: 10,
                      opacity: 0.55,
                      marginBottom: 6,
                    }}
                  />
                  <div
                    className={styles.placeholderBar}
                    style={{ width: "45%", height: 7, opacity: 0.25 }}
                  />
                </div>
                <div
                  className={styles.placeholderBar}
                  style={{ width: 10, height: 10, opacity: 0.25 }}
                />
              </div>

              <div className={styles.drawerItemBottom}>
                <div className={styles.drawerQuantity}>
                  <button type="button" disabled tabIndex={-1}>
                    −
                  </button>
                  <span>1</span>
                  <button type="button" disabled tabIndex={-1}>
                    +
                  </button>
                </div>

                <div
                  className={styles.placeholderBar}
                  style={{ width: 44, height: 10, opacity: 0.6 }}
                />
              </div>
            </div>
          </div>
        ))}

        {/* 5. Upsell Placeholder Card */}
        <div className={styles.drawerUpsell}>
          <div className={styles.drawerUpsellHeader}>
            <div
              className={styles.placeholderBar}
              style={{ width: 110, height: 7, opacity: 0.35 }}
            />
            <span className={styles.drawerUpsellBadge}>+ Offer</span>
          </div>
          <div className={styles.drawerUpsellContent}>
            <div
              className={styles.placeholderThumb}
              style={{ width: 36, height: 42 }}
            />
            <div className={styles.drawerUpsellInfo}>
              <div
                className={styles.placeholderBar}
                style={{ width: "70%", height: 8, marginBottom: 5, opacity: 0.5 }}
              />
              <div
                className={styles.placeholderBar}
                style={{ width: "35%", height: 7, opacity: 0.3 }}
              />
            </div>
            <button
              type="button"
              className={styles.drawerUpsellBtn}
              tabIndex={-1}
            >
              + Add
            </button>
          </div>
        </div>
      </main>

      {/* 6. Footer & Order Summary Placeholder */}
      <footer className={styles.drawerFooter}>
        <div className={styles.drawerSummaryRow}>
          <div
            className={styles.placeholderBar}
            style={{ width: 60, height: 9, opacity: 0.4 }}
          />
          <div
            className={styles.placeholderBar}
            style={{ width: 50, height: 11, opacity: 0.7 }}
          />
        </div>

        {/* Primary Checkout CTA Placeholder */}
        <button
          type="button"
          className={styles.drawerCheckoutBtn}
          tabIndex={-1}
        >
          <span>Checkout</span>
          <span>→</span>
        </button>

        {/* Trust Badges Placeholder */}
        <div className={styles.drawerTrustBadges}>
          <span className={styles.drawerTrustPill}>SSL Secure</span>
          <span className={styles.drawerTrustPill}>Fast Delivery</span>
          <span className={styles.drawerTrustPill}>30-Day Returns</span>
        </div>
      </footer>
    </div>
  );
}
