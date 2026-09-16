import * as React from "react";

export type AppIconBadgePropsType = {
  type?: string;
  bg?: string;
  name?: string;
  size?: number;
  logoUrl?: string;
};

export function AppIconBadge({
  type,
  bg,
  name,
  size = 40,
  logoUrl,
}: AppIconBadgePropsType) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name || "App icon"}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: `${Math.round(size * 0.24)}px`,
          objectFit: "cover",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.12)",
          flexShrink: 0,
        }}
      />
    );
  }

  const iconSize = Math.round(size * 0.58);
  const cornerRadius = Math.round(size * 0.24);

  return (
    <div
      aria-label={name || "App logo"}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        borderRadius: `${cornerRadius}px`,
        background: bg || "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.35)",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* 1. Claimify - Warranty & Claims Shield */}
      {(!type || type === "claimify") && (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            fill="rgba(255, 255, 255, 0.22)"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m9 12 2 2 4-4"
            stroke="#ffffff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* 2. Theme Scheduler */}
      {(type === "theme-scheduler" || type === "maestro-theme-scheduler") && (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="4"
            width="18"
            height="17"
            rx="3"
            fill="rgba(255, 255, 255, 0.18)"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <path d="M3 9h18" stroke="#ffffff" strokeWidth="1.8" />
          <path d="M8 2v4M16 2v4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="15.5" cy="15.5" r="3.5" fill="#4338ca" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M15.5 14v1.5l1 .6" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )}

      {/* 3. Products Scheduler */}
      {(type === "products-scheduler" || type === "maestro-products-scheduler") && (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <path
            d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
            fill="rgba(255, 255, 255, 0.18)"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <path d="m3.3 7 8.7 5 8.7-5M12 22V12" stroke="#ffffff" strokeWidth="1.8" />
          <circle cx="16.5" cy="16.5" r="3.5" fill="#6d28d9" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M16.5 15v1.5l1 .6" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )}

      {/* 4. Gift Card Checker */}
      {(type === "giftcard" || type === "giftcard-balance-checker") && (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <rect
            x="2"
            y="5"
            width="20"
            height="14"
            rx="3"
            fill="rgba(255, 255, 255, 0.2)"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <path d="M2 10h20" stroke="#ffffff" strokeWidth="2" />
          <circle cx="6.5" cy="15" r="1.5" fill="#ffffff" />
          <path d="M12 15h6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M17 3l.8 1.6 1.8.3-1.3 1.3.3 1.8L17 7.1 15.4 8l.3-1.8-1.3-1.3 1.8-.3z"
            fill="#ffffff"
          />
        </svg>
      )}

      {/* 5. Floaty Icons */}
      {type === "floaty" && (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
            fill="rgba(255, 255, 255, 0.2)"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <circle cx="8" cy="11.5" r="1.5" fill="#ffffff" />
          <circle cx="12" cy="11.5" r="1.5" fill="#ffffff" />
          <circle cx="16" cy="11.5" r="1.5" fill="#ffffff" />
        </svg>
      )}

      {/* 6. Visibility Scheduler */}
      {(type === "visibility-scheduler" || type === "theme-visibility-scheduler") && (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <path
            d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
            fill="rgba(255, 255, 255, 0.18)"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <circle cx="12" cy="12" r="3.2" fill="#ffffff" fillOpacity="0.4" stroke="#ffffff" strokeWidth="1.8" />
          <circle cx="17.5" cy="6.5" r="3" fill="#be185d" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M17.5 5.2V6.5l.8.6" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )}

      {/* 7. Workify */}
      {type === "workify" && (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <rect
            x="2"
            y="7"
            width="20"
            height="14"
            rx="3"
            fill="rgba(255, 255, 255, 0.2)"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="#ffffff" strokeWidth="2" />
          <path d="M12 11v3M9 12.5h6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}

      {/* 8. Rankify / Smart Collections */}
      {(type === "rankify" || type === "rank-smart-collections") && (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <path d="M18 20V10M12 20V4M6 20v-6" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <path d="m14 7 3.5-3.5L21 7" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {/* 9. Collections Scheduler */}
      {(type === "collections-scheduler" || type === "maestro-collections-scheduler") && (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <path
            d="M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"
            fill="rgba(255, 255, 255, 0.18)"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <path d="M8 2h8M6 4h12" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="15.5" cy="14.5" r="3.5" fill="#7e22ce" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M15.5 13v1.5l1 .6" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )}

      {/* 10. ORDA Order Tracker */}
      {type === "orda" && (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <path d="M12 2 3 7l9 5 9-5-9-5Z" fill="rgba(255, 255, 255, 0.3)" stroke="#ffffff" strokeWidth="1.8" />
          <path d="M3 7v10l9 5 9-5V7" stroke="#ffffff" strokeWidth="1.8" />
          <path d="M12 12v10" stroke="#ffffff" strokeWidth="1.8" />
          <circle cx="12" cy="7" r="1.5" fill="#ffffff" />
        </svg>
      )}

      {/* 11. Cartify */}
      {type === "cartify" && (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="20" r="1.5" fill="#ffffff" />
          <circle cx="18" cy="20" r="1.5" fill="#ffffff" />
          <path
            d="M1 1h4l2.6 13.2a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"
            fill="rgba(255, 255, 255, 0.18)"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M12 7v4M10 9h4" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}

      {/* 12. Quick Notice */}
      {type === "quick-notice" && (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <path
            d="m3 11 15-7v14L3 11z"
            fill="rgba(255, 255, 255, 0.2)"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M8 15.5V19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-4.5" stroke="#ffffff" strokeWidth="2" />
          <path d="M21 9a4 4 0 0 1 0 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}

      {/* 13. Matchly */}
      {type === "matchly" && (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="3"
            fill="rgba(255, 255, 255, 0.18)"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <path
            d="m7 8 2 2 4-4M7 14l2 2 4-4"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M16 16h2" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}

      {/* 14. Prizify */}
      {type === "prizify" && (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <path d="M6 9H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3M18 9h3a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3" stroke="#ffffff" strokeWidth="2" />
          <path
            d="M4 2h16v6a7 7 0 0 1-14 0V2z"
            fill="rgba(255, 255, 255, 0.22)"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <path d="M12 15v4M8 22h8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}

      {/* 15. SubFlow */}
      {type === "subflow" && (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <path
            d="M21.5 2v6h-6M2.5 22v-6h6"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21.34 15.57a10 10 0 0 1-17.9-2.57M2.66 8.43a10 10 0 0 1 17.9 2.57"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="2.5" fill="#ffffff" />
        </svg>
      )}
    </div>
  );
}
