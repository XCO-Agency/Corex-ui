import * as React from "react";
import { Box, InlineStack } from "@xco-agency/corex-ui";
import type { PlanAvatarPropsType } from "../types";

export function PlanAvatar({
  planId,
  size = 48,
  customSvg,
}: PlanAvatarPropsType) {
  const iconSize = Math.round(size * 0.62);
  const normalizedId = (planId || "free").toLowerCase();

  return (
    <Box
      background="subdued"
      borderWidth="base"
      borderColor="border-subdued"
      borderRadius="base"
      inlineSize={`${size}px`}
      blockSize={`${size}px`}
      minInlineSize={`${size}px`}
      maxInlineSize={`${size}px`}
      overflow="hidden"
    >
      <InlineStack
        alignItems="center"
        justifyContent="center"
        blockSize="100%"
        inlineSize="100%"
      >
        {customSvg ? (
          customSvg
        ) : normalizedId === "free" ? (
          /* 1. Free Plan - 3D Faceted Diamond Gem 💎 */
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 32 32"
            fill="none"
            aria-label="Free Plan Diamond Avatar"
          >
            <defs>
              {/* Top Table Facet Gradient */}
              <linearGradient id="gemTopTable" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="60%" stopColor="#bae6fd" />
                <stop offset="100%" stopColor="#7dd3fc" />
              </linearGradient>
              {/* Left Crown Facet */}
              <linearGradient id="gemCrownLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
              {/* Right Crown Facet */}
              <linearGradient id="gemCrownRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              {/* Center Crown Facet */}
              <linearGradient id="gemCrownCenter" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#bae6fd" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
              {/* Lower Center Pavilion Facet */}
              <linearGradient id="gemPavilionCenter" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
              {/* Lower Left Pavilion Facet */}
              <linearGradient id="gemPavilionLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              {/* Lower Right Pavilion Facet */}
              <linearGradient id="gemPavilionRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0369a1" />
                <stop offset="100%" stopColor="#075985" />
              </linearGradient>
            </defs>

            {/* Faceted Geometry */}
            {/* Top Table */}
            <polygon points="10,6 22,6 20,11 12,11" fill="url(#gemTopTable)" />
            {/* Crown Left */}
            <polygon points="4,11 10,6 12,11" fill="url(#gemCrownLeft)" />
            {/* Crown Center */}
            <polygon points="12,11 20,11 16,14" fill="url(#gemCrownCenter)" />
            {/* Crown Right */}
            <polygon points="22,6 28,11 20,11" fill="url(#gemCrownRight)" />

            {/* Upper Mid Connectors */}
            <polygon points="4,11 12,11 16,14" fill="#38bdf8" />
            <polygon points="28,11 20,11 16,14" fill="#0284c7" />

            {/* Lower Pavilion Left */}
            <polygon points="4,11 16,14 16,26" fill="url(#gemPavilionLeft)" />
            {/* Lower Pavilion Center */}
            <polygon points="12,11 20,11 16,14" fill="url(#gemTopTable)" opacity="0.6" />
            {/* Lower Pavilion Right */}
            <polygon points="28,11 16,14 16,26" fill="url(#gemPavilionRight)" />

            {/* Specular Edge Highlights */}
            <path
              d="M10,6 L22,6 M4,11 L16,14 L28,11"
              stroke="#ffffff"
              strokeWidth="0.8"
              strokeLinecap="round"
              opacity="0.75"
            />
            {/* Sparkle Glint at crown */}
            <circle cx="9" cy="8" r="1" fill="#ffffff" />
          </svg>
        ) : normalizedId === "starter" ? (
          /* 2. Starter Plan - Launch Rocket / Velocity Spark 🚀 */
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 32 32"
            fill="none"
            aria-label="Starter Plan Rocket Avatar"
          >
            <defs>
              <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <linearGradient id="rocketNose" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
              <linearGradient id="rocketFin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4338ca" />
              </linearGradient>
              <linearGradient id="rocketFlame" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>

            {/* Thrust Flame */}
            <path
              d="M10 22 C 8 25, 7 28, 9 29 C 10 30, 13 29, 16 25 Z"
              fill="url(#rocketFlame)"
            />
            <path
              d="M11 23 C 9.5 25, 9 27, 10.5 28 C 11.2 28.5, 13 28, 14.5 25 Z"
              fill="#fef08a"
            />

            {/* Left Fin */}
            <path d="M12 18 L6 20 C 6 16, 9 14, 11 14 Z" fill="url(#rocketFin)" />
            {/* Right Fin */}
            <path d="M20 18 L26 20 C 26 16, 23 14, 21 14 Z" fill="url(#rocketFin)" />

            {/* Main Rocket Fuselage */}
            <path
              d="M16 4 C 12 10, 11 18, 11 22 L 21 22 C 21 18, 20 10, 16 4 Z"
              fill="url(#rocketBody)"
            />

            {/* Nose Cone */}
            <path
              d="M16 4 C 13.8 8, 13 11, 13 12 L 19 12 C 19 11, 18.2 8, 16 4 Z"
              fill="url(#rocketNose)"
            />

            {/* Porthole Window */}
            <circle cx="16" cy="15" r="2.8" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
            <circle cx="15.2" cy="14.2" r="0.8" fill="#ffffff" />
          </svg>
        ) : normalizedId === "growth" ? (
          /* 3. Growth Plan - Emerald Rising Surge / Growth Prism 📈 */
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 32 32"
            fill="none"
            aria-label="Growth Plan Surge Avatar"
          >
            <defs>
              <linearGradient id="growthBar1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="growthBar2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="growthBar3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="growthArrow" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a7f3d0" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>

            {/* Bar 1 */}
            <rect x="5" y="18" width="5.5" height="9" rx="2" fill="url(#growthBar1)" />
            {/* Bar 2 */}
            <rect x="13.25" y="12" width="5.5" height="15" rx="2" fill="url(#growthBar2)" />
            {/* Bar 3 */}
            <rect x="21.5" y="6" width="5.5" height="21" rx="2" fill="url(#growthBar3)" />

            {/* Dynamic Growth Trend Arrow */}
            <path
              d="M6 16 L 14 10 L 23 5"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 5 L 24 5 L 24 11"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Star Sparkle at Peak */}
            <polygon
              points="24,2 25,4 27,5 25,6 24,8 23,6 21,5 23,4"
              fill="#fbbf24"
            />
          </svg>
        ) : normalizedId === "scale" ? (
          /* 4. Scale Plan - Sovereign Imperial Crown 👑 */
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 32 32"
            fill="none"
            aria-label="Scale Plan Crown Avatar"
          >
            <defs>
              <linearGradient id="crownGold1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="45%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="crownGold2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="crownRim" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="50%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>

            {/* Crown Body with 3 Peaks */}
            <path
              d="M5 23 L 6.5 12 L 11 16 L 16 8 L 21 16 L 25.5 12 L 27 23 Z"
              fill="url(#crownGold1)"
            />

            {/* Center Peak Highlight */}
            <polygon points="16,8 11,16 16,23 21,16" fill="url(#crownGold2)" opacity="0.85" />

            {/* Crown Bottom Rim */}
            <rect x="4.5" y="22" width="23" height="4.5" rx="2" fill="url(#crownRim)" />

            {/* Crown Jewels */}
            <circle cx="6.5" cy="11.5" r="1.6" fill="#ffffff" />
            <circle cx="16" cy="7.5" r="1.8" fill="#ffffff" />
            <circle cx="25.5" cy="11.5" r="1.6" fill="#ffffff" />

            {/* Insets on rim */}
            <circle cx="10" cy="24.25" r="1.2" fill="#ef4444" />
            <circle cx="16" cy="24.25" r="1.4" fill="#0284c7" />
            <circle cx="22" cy="24.25" r="1.2" fill="#ef4444" />
          </svg>
        ) : (
          /* 5. Enterprise / Fallback - Executive Platinum Shield 🛡️ */
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 32 32"
            fill="none"
            aria-label="Enterprise Plan Shield Avatar"
          >
            <defs>
              <linearGradient id="shieldPlate" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
              <linearGradient id="shieldShine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#93c5fd" />
              </linearGradient>
            </defs>

            {/* Shield Outline */}
            <path
              d="M16 4 L 26 8 C 26 18, 19 25, 16 28 C 13 25, 6 18, 6 8 Z"
              fill="url(#shieldPlate)"
              stroke="#60a5fa"
              strokeWidth="1.5"
            />

            {/* Inner Crest Star */}
            <path
              d="M16 9 L 17.5 13.5 L 22 14 L 18.5 17 L 19.5 21.5 L 16 19 L 12.5 21.5 L 13.5 17 L 10 14 L 14.5 13.5 Z"
              fill="url(#shieldShine)"
            />
          </svg>
        )}
      </InlineStack>
    </Box>
  );
}
