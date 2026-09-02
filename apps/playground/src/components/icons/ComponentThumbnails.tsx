import type { ReactNode } from "react";

/**
 * Abstract wireframe illustrations for the Overview grid — one per
 * component, sharing a common viewBox and a neutral-gray + accent-blue
 * palette so the grid reads as one consistent set rather than 16 one-off
 * icons. Purely decorative; not part of the published library.
 */
function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      className="thumbnail-svg"
      viewBox="0 0 160 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const gray = "#d3d5d8";
const grayStrong = "#9aa0a6";
const border = "#c9cccf";
const accent = "#2c6ecb";

export function ButtonThumbnail() {
  return (
    <Frame>
      <rect x="52" y="38" width="56" height="24" rx="6" fill={accent} fillOpacity="0.12" stroke={accent} strokeWidth="1.5" />
      <rect x="66" y="47" width="28" height="6" rx="3" fill={accent} />
    </Frame>
  );
}

export function ButtonGroupThumbnail() {
  return (
    <Frame>
      <rect x="30" y="40" width="32" height="22" rx="4" fill="#eef0f1" stroke={border} />
      <rect x="64" y="40" width="32" height="22" rx="4" fill={accent} fillOpacity="0.12" stroke={accent} />
      <rect x="98" y="40" width="32" height="22" rx="4" fill="#eef0f1" stroke={border} />
    </Frame>
  );
}

export function TextThumbnail() {
  return (
    <Frame>
      <rect x="30" y="28" width="70" height="10" rx="2" fill={grayStrong} />
      <rect x="30" y="48" width="100" height="6" rx="2" fill={gray} />
      <rect x="30" y="58" width="90" height="6" rx="2" fill={gray} />
      <rect x="30" y="68" width="60" height="6" rx="2" fill={gray} />
    </Frame>
  );
}

export function BadgeThumbnail() {
  return (
    <Frame>
      <rect x="50" y="42" width="60" height="18" rx="9" fill="#e3f5e9" stroke="#3f9142" />
      <circle cx="62" cy="51" r="3" fill="#3f9142" />
      <rect x="72" y="48" width="28" height="6" rx="3" fill="#3f9142" fillOpacity="0.6" />
    </Frame>
  );
}

export function BannerThumbnail() {
  return (
    <Frame>
      <rect x="20" y="30" width="120" height="40" rx="6" fill="#fff4e4" stroke="#b98900" />
      <circle cx="40" cy="50" r="8" fill="#b98900" fillOpacity="0.35" />
      <rect x="58" y="42" width="70" height="6" rx="3" fill="#b98900" />
      <rect x="58" y="54" width="50" height="6" rx="3" fill="#b98900" fillOpacity="0.6" />
    </Frame>
  );
}

export function SpinnerThumbnail() {
  return (
    <Frame>
      <circle cx="80" cy="50" r="18" fill="none" stroke={gray} strokeWidth="5" />
      <path d="M80 32 a18 18 0 0 1 18 18" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" />
    </Frame>
  );
}

export function BoxThumbnail() {
  return (
    <Frame>
      <rect x="45" y="25" width="70" height="50" rx="4" fill="#f6f6f7" stroke={border} strokeDasharray="4 3" />
    </Frame>
  );
}

export function BlockStackThumbnail() {
  return (
    <Frame>
      <rect x="40" y="22" width="80" height="14" rx="3" fill="#e4e6e8" />
      <rect x="40" y="43" width="80" height="14" rx="3" fill="#e4e6e8" />
      <rect x="40" y="64" width="80" height="14" rx="3" fill="#e4e6e8" />
    </Frame>
  );
}

export function InlineStackThumbnail() {
  return (
    <Frame>
      <rect x="28" y="38" width="26" height="24" rx="3" fill="#e4e6e8" />
      <rect x="67" y="38" width="26" height="24" rx="3" fill="#e4e6e8" />
      <rect x="106" y="38" width="26" height="24" rx="3" fill="#e4e6e8" />
    </Frame>
  );
}

export function CardThumbnail() {
  return (
    <Frame>
      <rect x="30" y="20" width="100" height="60" rx="6" fill="#ffffff" stroke={border} />
      <rect x="42" y="32" width="50" height="8" rx="2" fill={grayStrong} />
      <rect x="42" y="48" width="76" height="5" rx="2" fill={gray} />
      <rect x="42" y="58" width="60" height="5" rx="2" fill={gray} />
    </Frame>
  );
}

export function PageThumbnail() {
  return (
    <Frame>
      <rect x="18" y="14" width="124" height="72" rx="4" fill="#ffffff" stroke={border} />
      <rect x="28" y="24" width="50" height="8" rx="2" fill={grayStrong} />
      <rect x="110" y="22" width="24" height="12" rx="3" fill={accent} fillOpacity="0.5" />
      <rect x="28" y="44" width="104" height="6" rx="2" fill="#e4e6e8" />
      <rect x="28" y="54" width="104" height="6" rx="2" fill="#e4e6e8" />
      <rect x="28" y="64" width="70" height="6" rx="2" fill="#e4e6e8" />
    </Frame>
  );
}

export function TextFieldThumbnail() {
  return (
    <Frame>
      <rect x="35" y="28" width="50" height="6" rx="2" fill={grayStrong} />
      <rect x="35" y="42" width="90" height="22" rx="4" fill="#ffffff" stroke={border} />
      <rect x="43" y="50" width="30" height="4" rx="2" fill={border} />
    </Frame>
  );
}

export function SelectThumbnail() {
  return (
    <Frame>
      <rect x="35" y="28" width="50" height="6" rx="2" fill={grayStrong} />
      <rect x="35" y="42" width="90" height="22" rx="4" fill="#ffffff" stroke={border} />
      <path d="M111 50 l4 5 l4 -5" fill="none" stroke={grayStrong} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

export function CheckboxThumbnail() {
  return (
    <Frame>
      <rect x="38" y="44" width="18" height="18" rx="4" fill={accent} fillOpacity="0.12" stroke={accent} />
      <path d="M43 53 l4 4 l8 -8" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="64" y="50" width="60" height="6" rx="2" fill={gray} />
    </Frame>
  );
}

export function ModalThumbnail() {
  return (
    <Frame>
      <rect x="10" y="10" width="140" height="80" rx="4" fill="#eef0f1" />
      <rect x="40" y="26" width="80" height="48" rx="6" fill="#ffffff" stroke={border} />
      <rect x="50" y="36" width="40" height="7" rx="2" fill={grayStrong} />
      <rect x="50" y="50" width="60" height="5" rx="2" fill={gray} />
      <rect x="80" y="62" width="30" height="10" rx="3" fill={accent} fillOpacity="0.6" />
    </Frame>
  );
}

export function TabsThumbnail() {
  return (
    <Frame>
      <rect x="30" y="28" width="30" height="10" rx="2" fill={accent} />
      <rect x="30" y="40" width="30" height="2" fill={accent} />
      <rect x="66" y="28" width="30" height="10" rx="2" fill={gray} />
      <rect x="102" y="28" width="30" height="10" rx="2" fill={gray} />
      <rect x="30" y="46" width="100" height="1" fill="#e1e3e5" />
      <rect x="30" y="56" width="90" height="6" rx="2" fill="#e4e6e8" />
      <rect x="30" y="66" width="60" height="6" rx="2" fill="#e4e6e8" />
    </Frame>
  );
}

export const thumbnails: Record<string, React.ComponentType> = {
  button: ButtonThumbnail,
  "button-group": ButtonGroupThumbnail,
  text: TextThumbnail,
  badge: BadgeThumbnail,
  banner: BannerThumbnail,
  spinner: SpinnerThumbnail,
  box: BoxThumbnail,
  "block-stack": BlockStackThumbnail,
  "inline-stack": InlineStackThumbnail,
  card: CardThumbnail,
  page: PageThumbnail,
  "text-field": TextFieldThumbnail,
  select: SelectThumbnail,
  checkbox: CheckboxThumbnail,
  modal: ModalThumbnail,
  tabs: TabsThumbnail,
};
