import { Page } from "@xco-agency/corex-ui";
import { OnboardingNew } from "../OnboardingNew";

export function OnboardingNewExample() {
  return (
    <Page heading="Get started" inlineSize="large">
      <OnboardingNew
        initialCompletedStages={["volume", "brand"]}
        onGoToDashboard={() => {
          alert("Navigating to Merchant Dashboard!");
        }}
      />
    </Page>
  );
}

export default OnboardingNewExample;
