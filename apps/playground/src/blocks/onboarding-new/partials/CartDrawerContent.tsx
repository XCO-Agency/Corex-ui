import { useState } from "react";
import type { BrandColorsType, CartPresetIdType } from "../types";
import styles from "../cart-variants.module.css";

export interface CartDrawerItemType {
  id: string;
  title: string;
  variant?: string;
  price: number;
  compareAtPrice?: number;
  saveBadge?: string;
  stockNotice?: string;
  quantity: number;
  image: string;
}

export interface CartDrawerContentPropsType {
  preset: CartPresetIdType;
  brand: BrandColorsType;
  currency?: string;
  interactive?: boolean;
  onClose?: () => void;
}

const INITIAL_ITEMS: CartDrawerItemType[] = [
  {
    id: "1",
    title: "Essential Oversized Tee",
    variant: "Black / Large",
    price: 29,
    compareAtPrice: 36,
    saveBadge: "Save 20%",
    stockNotice: "Only 3 left in stock",
    quantity: 1,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
  },
  {
    id: "2",
    title: "Relaxed Everyday Pants",
    variant: "Stone / 32",
    price: 64,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80",
  },
];

const UPSELL_ITEM: CartDrawerItemType = {
  id: "upsell-beanie",
  title: "Merino Wool Beanie",
  variant: "Charcoal / One Size",
  price: 18,
  compareAtPrice: 24,
  quantity: 1,
  image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&q=80",
};

export function CartDrawerContent({
  preset,
  brand,
  currency = "MAD",
  interactive = true,
  onClose,
}: CartDrawerContentPropsType) {
  const [items, setItems] = useState<CartDrawerItemType[]>(INITIAL_ITEMS);
  const [protectionEnabled, setProtectionEnabled] = useState(true);
  const [upsellAdded, setUpsellAdded] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(true);
  const [checkoutFeedback, setCheckoutFeedback] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = promoApplied ? 5 : 0;
  const protectionFee = protectionEnabled ? 2.99 : 0;
  const estimatedTotal = Math.max(0, subtotal - discount + protectionFee);

  // Free shipping goal threshold at 100
  const freeShippingThreshold = 100;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgressPct = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100),
  );
  const isFreeShippingUnlocked = remainingForFreeShipping === 0;

  const handleQuantityChange = (id: string, delta: number) => {
    if (!interactive) return;
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemove = (id: string) => {
    if (!interactive) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (id === UPSELL_ITEM.id) {
      setUpsellAdded(false);
    }
  };

  const handleToggleUpsell = () => {
    if (!interactive) return;
    if (upsellAdded) {
      setItems((prev) => prev.filter((item) => item.id !== UPSELL_ITEM.id));
      setUpsellAdded(false);
    } else {
      setItems((prev) => [...prev, UPSELL_ITEM]);
      setUpsellAdded(true);
    }
  };

  const handleApplyPromo = () => {
    if (!interactive) return;
    if (promoCode.trim().length > 0) {
      setPromoApplied(true);
    }
  };

  const handleCheckout = () => {
    if (!interactive) return;
    setCheckoutFeedback(true);
    setTimeout(() => setCheckoutFeedback(false), 2200);
  };

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
  const resolvedSurface = isBold ? "#1a1b20" : "#f6f6f7";

  return (
    <div
      className={`${styles.cart} ${styles[`preset-${preset}`]} ${
        !interactive ? styles.cartPreviewMode : ""
      }`}
      style={
        {
          "--cart-primary": resolvedPrimary,
          "--cart-secondary": resolvedText,
          "--cart-accent": resolvedAccent,
          "--cart-background": resolvedBg,
          "--cart-surface": resolvedSurface,
        } as React.CSSProperties
      }
    >
      {/* 1. Contextual Announcement Banner */}
      <div className={styles.announcementBanner}>
        <span>
          {preset === "editorial"
            ? "✦ Complimentary signature gift packaging on all orders"
            : preset === "bold"
              ? "⚡️ EXCLUSIVE OFFER: Free standard express delivery unlocked"
              : preset === "rounded"
                ? "✨ Free gift automatically included with orders over 80 MAD!"
                : "Limited Release • Free 30-day domestic returns"}
        </span>
      </div>

      {/* 2. Header */}
      <header className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.eyebrow}>
            {preset === "editorial" ? "Your Cart Collection" : "Your Selection"}
          </span>
          <h1 className={styles.title}>Your Cart</h1>
        </div>

        <div className={styles.headerActions}>
          <span className={styles.count}>{items.length}</span>
          {onClose && (
            <button
              type="button"
              className={styles.remove}
              onClick={onClose}
              aria-label="Close cart drawer"
            >
              ×
            </button>
          )}
        </div>
      </header>

      {/* 3. Cart Reservation Urgency Timer */}
      <div className={styles.cartTimer}>
        <span className={styles.timerIcon}>⏱</span>
        <span>
          High demand: items reserved for <strong>09:42</strong>
        </span>
      </div>

      {/* 4. Free Shipping Tier Progress Bar */}
      <div className={styles.shippingBar}>
        <div className={styles.shippingBarText}>
          {isFreeShippingUnlocked ? (
            <span className={styles.shippingUnlocked}>
              🎉 You unlocked <strong>FREE Shipping</strong>!
            </span>
          ) : (
            <span>
              Add{" "}
              <strong>
                {currency} {remainingForFreeShipping.toFixed(2)}
              </strong>{" "}
              more to unlock <strong>FREE Shipping</strong>
            </span>
          )}
        </div>
        <div className={styles.shippingTrack}>
          <div
            className={styles.shippingFill}
            style={{ width: `${shippingProgressPct}%` }}
          />
        </div>
      </div>

      {/* 5. Cart Items */}
      <main className={styles.items}>
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 10px" }}>
            <p style={{ margin: "0 0 8px", fontWeight: 600 }}>Your cart is empty</p>
            <p style={{ margin: 0, fontSize: "12px", opacity: 0.6 }}>
              Add trending products to test this drawer.
            </p>
          </div>
        ) : (
          (interactive ? items : items.slice(0, 1)).map((item) => (
            <article className={styles.item} key={item.id}>
              <img className={styles.productImage} src={item.image} alt={item.title} />

              <div className={styles.itemContent}>
                <div className={styles.itemTop}>
                  <div>
                    <h2 className={styles.productTitle}>{item.title}</h2>
                    {item.variant && (
                      <p className={styles.productVariant}>{item.variant}</p>
                    )}
                    {(item.saveBadge || item.stockNotice) && (
                      <div className={styles.itemBadges}>
                        {item.saveBadge && (
                          <span className={styles.saveBadge}>{item.saveBadge}</span>
                        )}
                        {item.stockNotice && (
                          <span className={styles.stockNotice}>{item.stockNotice}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className={styles.remove}
                    onClick={() => handleRemove(item.id)}
                    aria-label={`Remove ${item.title}`}
                  >
                    ×
                  </button>
                </div>

                <div className={styles.itemBottom}>
                  <div className={styles.quantity}>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item.id, 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className={styles.priceGroup}>
                    {item.compareAtPrice && (
                      <span className={styles.comparePrice}>
                        {currency} {(item.compareAtPrice * item.quantity).toFixed(2)}
                      </span>
                    )}
                    <strong className={styles.itemPrice}>
                      {currency} {(item.price * item.quantity).toFixed(2)}
                    </strong>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}

        {/* 6. In-Cart 1-Click Upsell Recommendation */}
        <section className={styles.upsellSection}>
          <div className={styles.upsellHeader}>
            <h3 className={styles.upsellTitle}>Frequently Added Together</h3>
            <span className={styles.upsellBadge}>⚡️ 25% Off</span>
          </div>
          <div className={styles.upsellCard}>
            <img
              className={styles.upsellImage}
              src={UPSELL_ITEM.image}
              alt={UPSELL_ITEM.title}
            />
            <div className={styles.upsellInfo}>
              <p className={styles.upsellName}>{UPSELL_ITEM.title}</p>
              <p className={styles.upsellPrice}>
                <strong>
                  {currency} {UPSELL_ITEM.price.toFixed(2)}
                </strong>{" "}
                <span className={styles.comparePrice}>
                  {currency} {UPSELL_ITEM.compareAtPrice?.toFixed(2)}
                </span>
              </p>
            </div>
            <button
              type="button"
              className={`${styles.upsellBtn} ${upsellAdded ? styles.upsellBtnAdded : ""}`}
              onClick={handleToggleUpsell}
            >
              {upsellAdded ? "✓ Added" : "+ Add"}
            </button>
          </div>
        </section>
      </main>

      {/* 7. Footer & Order Summary */}
      <footer className={styles.footer}>
        <div className={styles.summary}>
          <div className={styles.summaryHeader}>
            <span>Estimated Total</span>
            <strong>
              {currency} {estimatedTotal.toFixed(2)}
            </strong>
          </div>

          <div className={styles.summaryDetails}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>
                {currency} {subtotal.toFixed(2)}
              </span>
            </div>

            {/* Shipping Protection Add-on */}
            <div className={styles.summaryRow}>
              <span
                className={styles.protectionLabel}
                onClick={() => interactive && setProtectionEnabled(!protectionEnabled)}
              >
                <span
                  className={`${styles.checkbox} ${!protectionEnabled ? styles.checkboxUnchecked : ""}`}
                >
                  ✓
                </span>
                <span>Package Protection</span>
                <span
                  className={styles.info}
                  title="Guaranteed protection against loss, theft or damage during transit."
                >
                  i
                </span>
              </span>
              <span>
                +{currency} {protectionFee.toFixed(2)}
              </span>
            </div>

            {/* Promo Code Discount */}
            {promoApplied && (
              <div className={styles.summaryRow}>
                <span>Discount (WELCOME5)</span>
                <span className={styles.discount}>
                  −{currency} {discount.toFixed(2)}
                </span>
              </div>
            )}

            <div className={styles.summaryRow}>
              <span>Standard Shipping</span>
              <span className={isFreeShippingUnlocked ? styles.discount : ""}>
                {isFreeShippingUnlocked ? "FREE" : `${currency} 15.00`}
              </span>
            </div>

            {/* Promo Code Input Field */}
            <div className={styles.promoRow}>
              <input
                className={styles.promoInput}
                type="text"
                placeholder="Discount code or gift card"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button
                type="button"
                className={styles.promoBtn}
                onClick={handleApplyPromo}
              >
                Apply
              </button>
            </div>

            <p className={styles.tax}>Taxes calculated at checkout</p>

            <div className={styles.finalTotal}>
              <span>Estimated Total</span>
              <strong>
                {currency} {estimatedTotal.toFixed(2)}
              </strong>
            </div>
          </div>
        </div>

        {/* Primary Checkout CTA */}
        <button type="button" className={styles.checkout} onClick={handleCheckout}>
          <span>{checkoutFeedback ? "Processing..." : "🔒 Secure Checkout"}</span>
          <span>
            {currency} {estimatedTotal.toFixed(2)} →
          </span>
        </button>

        {onClose && (
          <button
            type="button"
            className={styles.continueShopping}
            onClick={onClose}
          >
            Continue shopping
          </button>
        )}

        {/* Trust Badges & Payment Methods */}
        <div className={styles.trustFooter}>
          <div className={styles.trustGuarantee}>
            <span>🛡️</span>
            <span>256-Bit SSL Encrypted • 30-Day Money-Back Guarantee</span>
          </div>
          <div className={styles.paymentPills}>
            <span className={styles.paymentPill}>Apple Pay</span>
            <span className={styles.paymentPill}>Shop Pay</span>
            <span className={styles.paymentPill}>GPay</span>
            <span className={styles.paymentPill}>Visa</span>
            <span className={styles.paymentPill}>Mastercard</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
