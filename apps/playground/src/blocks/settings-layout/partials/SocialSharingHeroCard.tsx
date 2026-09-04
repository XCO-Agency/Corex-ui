import { Box, BlockStack, InlineStack, Badge, Text, Link } from "@xco-agency/corex-ui";

export function SocialSharingHeroCard() {
  return (
    <div
      style={{
        borderRadius: "14px",
        border: "1px solid #e1e3e5",
        backgroundColor: "#ffffff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {/* Left Graphic Preview */}
      <div
        style={{
          flex: "1 1 240px",
          maxWidth: "280px",
          minHeight: "180px",
          background:
            "repeating-linear-gradient(45deg, #a7f3d0, #a7f3d0 8px, #86efac 8px, #86efac 16px)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        {/* Mockup Review Card */}
        <div
          style={{
            position: "relative",
            width: "110px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            padding: "8px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "60px",
              borderRadius: "6px",
              backgroundColor: "#fde68a",
              backgroundImage:
                "radial-gradient(circle at 50% 50%, #fef3c7 30%, #fcd34d 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "20px" }}>✨</span>
          </div>

          <div style={{ display: "flex", gap: "2px", color: "#1d4ed8", fontSize: "10px" }}>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
          </div>
        </div>

        {/* Social Badges Floating around card */}
        {/* Instagram */}
        <div
          style={{
            position: "absolute",
            top: "22px",
            left: "26px",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
            border: "2px solid #ffffff",
            boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          📷
        </div>

        {/* Facebook */}
        <div
          style={{
            position: "absolute",
            top: "54px",
            right: "26px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "#1877f2",
            border: "2px solid #ffffff",
            boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: "18px",
            fontWeight: 700,
            fontFamily: "sans-serif",
          }}
        >
          f
        </div>

        {/* X (formerly Twitter) */}
        <div
          style={{
            position: "absolute",
            bottom: "22px",
            left: "30px",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            backgroundColor: "#000000",
            border: "2px solid #ffffff",
            boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 800,
            fontFamily: "sans-serif",
          }}
        >
          𝕏
        </div>
      </div>

      {/* Right Content */}
      <div style={{ flex: "2 1 320px", padding: "24px", boxSizing: "border-box" }}>
        <BlockStack gap="300">
          <InlineStack gap="200" align="start" blockAlign="center">
            <Text as="h2" variant="headingMd">
              Share your reviews on Facebook, Instagram and X
            </Text>
            <Badge tone="neutral">Off</Badge>
          </InlineStack>

          <Text as="p" variant="bodySm" tone="neutral">
            Share your reviews across your social media channels. Connect your Facebook Page,
            Instagram, or X account to Judge.me and automatically share reviews according to
            your chosen criteria. You can share reviews manually from your Reviews Dashboard.
          </Text>

          <Box padding="100">
            <Link url="#">Learn more</Link>
          </Box>
        </BlockStack>
      </div>
    </div>
  );
}
