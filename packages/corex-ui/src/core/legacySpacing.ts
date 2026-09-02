/** Translates legacy Polaris spacing tokens to Polaris web-component tokens. */
const legacySpacing: Record<string, 
string> = {
  "0": "none", 
  "025": "small-500", 
  "050": "small-400", 
  "100": "small-300",
  "150": "small-200", 
  "200": "small", 
  "300": "small-100", 
  "400": "base",
  "500": "large", 
  "600": "large-100", 
  "800": "large-200", 
  "1000": "large-300",
  "1200": "large-400", 
  "1600": "large-500", 
  "2000": "large-500",
  "2400": "large-500", 
  "3200": "large-500",
};

export function mapLegacyGap(gap: string | undefined) {
  if (!gap) return gap;
  return gap.split(" ").map((value) => legacySpacing[value] ?? value).join(" ");
}
