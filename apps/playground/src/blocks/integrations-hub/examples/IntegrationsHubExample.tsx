import * as React from "react";
import { Page, BlockStack, Grid, Banner } from "@xco-agency/corex-ui";
import { MOCK_INTEGRATIONS, MOCK_WEBHOOK_LOGS } from "../constants";
import { IntegrationCard } from "../partials/IntegrationCard";
import { IntegrationCategoryTabs } from "../partials/IntegrationCategoryTabs";
import { IntegrationConfigModal } from "../partials/IntegrationConfigModal";
import { WebhookLogCard } from "../partials/WebhookLogCard";
import type {
  IntegrationCategoryType,
  IntegrationItemType,
  WebhookLogItemType,
} from "../types";

export function IntegrationsHubExample() {
  const [integrations, setIntegrations] =
    React.useState<IntegrationItemType[]>(MOCK_INTEGRATIONS);
  const [logs, setLogs] =
    React.useState<WebhookLogItemType[]>(MOCK_WEBHOOK_LOGS);
  const [selectedCategory, setSelectedCategory] =
    React.useState<IntegrationCategoryType>("all");
  const [activeConfigIntegration, setActiveConfigIntegration] =
    React.useState<IntegrationItemType | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const categories = React.useMemo(() => {
    return [
      {
        id: "all" as IntegrationCategoryType,
        label: "All Services",
        count: integrations.length,
      },
      {
        id: "marketing" as IntegrationCategoryType,
        label: "Marketing",
        count: integrations.filter((i) => i.category === "marketing").length,
      },
      {
        id: "support" as IntegrationCategoryType,
        label: "Customer Support",
        count: integrations.filter((i) => i.category === "support").length,
      },
      {
        id: "analytics" as IntegrationCategoryType,
        label: "Analytics",
        count: integrations.filter((i) => i.category === "analytics").length,
      },
      {
        id: "webhooks" as IntegrationCategoryType,
        label: "Custom Webhooks",
        count: integrations.filter((i) => i.category === "webhooks").length,
      },
    ];
  }, [integrations]);

  const filteredIntegrations = React.useMemo(() => {
    if (selectedCategory === "all") return integrations;
    return integrations.filter((i) => i.category === selectedCategory);
  }, [integrations, selectedCategory]);

  const handleToggleSync = (id: string, enabled: boolean) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, syncEnabled: enabled } : item,
      ),
    );
  };

  const handleSaveConfig = (
    id: string,
    config: { apiKey?: string; webhookUrl?: string },
  ) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...config,
              status: "connected",
              syncEnabled: true,
              lastSyncedAt: "Just now",
            }
          : item,
      ),
    );
    setToastMessage(`Saved configuration for ${id}!`);
  };

  const handleTestConnection = async (_id: string): Promise<boolean> => {
    await new Promise((res) => setTimeout(res, 600));
    return true;
  };

  const handleRefreshLogs = () => {
    const newLog: WebhookLogItemType = {
      id: `log-${Date.now()}`,
      topic: "cart/updated",
      status: "success",
      statusCode: 200,
      timestamp: "Just now",
      durationMs: 94,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 5)]);
  };

  return (
    <Page
      heading="Integrations & Webhooks"
      subheading="Connect external services to synchronize cart events, customer profiles, and notifications."
      inlineSize="large"
    >
      <BlockStack gap="base">
        {toastMessage && (
          <Banner
            tone="success"
            title={toastMessage}
            onDismiss={() => setToastMessage(null)}
          />
        )}

        {/* Category Tabs */}
        <IntegrationCategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Integration Cards Grid */}
        <Grid columns={{ xs: 1, sm: 1, md: 2, lg: 3 }} gap="base">
          {filteredIntegrations.map((item) => (
            <IntegrationCard
              key={item.id}
              integration={item}
              onToggleSync={handleToggleSync}
              onConfigure={setActiveConfigIntegration}
            />
          ))}
        </Grid>

        {/* Webhook Delivery Log */}
        <WebhookLogCard logs={logs} onRefresh={handleRefreshLogs} />

        {/* Setup Configuration Modal */}
        <IntegrationConfigModal
          open={activeConfigIntegration !== null}
          integration={activeConfigIntegration}
          onClose={() => setActiveConfigIntegration(null)}
          onSave={handleSaveConfig}
          onTestConnection={handleTestConnection}
        />
      </BlockStack>
    </Page>
  );
}
