import { Page } from "@xco-agency/corex-ui";
import { Onboarding } from "../onboarding";

export function OnboardingExample() {
  return (
    <Page heading="Get started" inlineSize="large">
      <Onboarding
        onGoToDashboard={() => {
          alert("Redirect to Revenue Dashboard");
        }}
        onExit={() => {
          alert("Exit onboarding setup");
        }}
      />
    </Page>
  );
}

export default OnboardingExample;
