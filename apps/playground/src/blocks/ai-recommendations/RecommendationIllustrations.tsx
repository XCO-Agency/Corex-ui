import * as React from "react";

export function FrequentlyBoughtTogetherIllustration(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 110 100"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="fbt-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EEF2FF" />
          <stop offset="100%" stopColor="#E0E7FF" />
        </linearGradient>
        <linearGradient id="fbt-box-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="fbt-box-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>
      </defs>
      {/* Full-bleed background */}
      <rect width="100%" height="100%" fill="url(#fbt-bg)" />

      {/* Main product box */}
      <g transform="translate(14 26)">
        <rect width="36" height="36" rx="7" fill="url(#fbt-box-a)" />
        <rect x="6" y="11" width="22" height="3.5" rx="1.5" fill="#FFFFFF" opacity="0.9" />
        <rect x="6" y="18" width="14" height="3.5" rx="1.5" fill="#FFFFFF" opacity="0.6" />
        <circle cx="26" cy="26" r="3" fill="#A5B4FC" />
      </g>

      {/* Add-on product box */}
      <g transform="translate(60 26)">
        <rect width="36" height="36" rx="7" fill="url(#fbt-box-b)" />
        <circle cx="18" cy="18" r="10" fill="#FFFFFF" opacity="0.2" />
        <path
          d="M18 12v12M12 18h12"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* Connector checkmark badge */}
      <circle cx="55" cy="44" r="10" fill="#10B981" />
      <path
        d="M51 44l2.5 2.5 5.5-5.5"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Dashed connector line */}
      <path
        d="M44 44h-3M69 44h-3"
        stroke="#6366F1"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="1.5 2"
        opacity="0.7"
      />
    </svg>
  );
}

export function ShippingProtectionIllustration(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 110 100"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="shield-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ECFDF5" />
          <stop offset="100%" stopColor="#D1FAE5" />
        </linearGradient>
        <linearGradient id="shield-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      {/* Full-bleed background */}
      <rect width="100%" height="100%" fill="url(#shield-bg)" />

      {/* Shield Graphic */}
      <g transform="translate(36 16)">
        <path
          d="M19 2 38 10v17c0 15-8.5 25-19 29C8.5 52 0 42 0 27V10z"
          fill="url(#shield-grad)"
        />
        <path
          d="M12 27l5 5 10-10"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Price tag badge */}
      <g transform="translate(56 56)">
        <rect width="38" height="18" rx="9" fill="#065F46" />
        <text
          x="19"
          y="12.5"
          fill="#ECFDF5"
          fontSize="9"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          $1.99
        </text>
      </g>

      {/* Background soft particles */}
      <circle cx="20" cy="30" r="3" fill="#10B981" opacity="0.6" />
      <circle cx="16" cy="70" r="2.5" fill="#34D399" opacity="0.5" />
      <circle cx="92" cy="28" r="3.5" fill="#10B981" opacity="0.4" />
    </svg>
  );
}

export function PostPurchaseFunnelIllustration(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 110 100"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="funnel-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </linearGradient>
        <linearGradient id="bolt-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="card-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      {/* Full-bleed background */}
      <rect width="100%" height="100%" fill="url(#funnel-bg)" />

      {/* 1-Click Card Representation */}
      <g transform="translate(18 24)">
        <rect width="46" height="32" rx="6" fill="url(#card-grad)" />
        <rect x="5" y="7" width="10" height="7" rx="1.5" fill="#FCD34D" />
        <rect x="5" y="19" width="22" height="2.5" rx="1" fill="#BFDBFE" />
      </g>

      {/* Instant 1-Click Lightning Badge */}
      <g transform="translate(60 18)">
        <circle cx="19" cy="19" r="18" fill="url(#bolt-grad)" />
        <path
          d="M21 9L11 21h7l-2 10 10-13h-7z"
          fill="#FFFFFF"
        />
      </g>

      {/* 20% OFF Pill */}
      <g transform="translate(24 62)">
        <rect width="64" height="18" rx="9" fill="#78350F" />
        <text
          x="32"
          y="12.5"
          fill="#FEF3C7"
          fontSize="8.5"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          20% OFF 1-CLICK
        </text>
      </g>
    </svg>
  );
}

export function RecommendationIllustration({
  actionType,
}: {
  actionType?: string;
}): React.JSX.Element {
  switch (actionType) {
    case "create_fbt":
      return <FrequentlyBoughtTogetherIllustration />;
    case "create_addon":
      return <ShippingProtectionIllustration />;
    case "enable_post_purchase":
      return <PostPurchaseFunnelIllustration />;
    default:
      return <FrequentlyBoughtTogetherIllustration />;
  }
}
