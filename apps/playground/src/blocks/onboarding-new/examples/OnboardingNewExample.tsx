import { OnboardingNew } from "../OnboardingNew";

export function OnboardingNewExample() {
  return (
    <OnboardingNew
      initialCompletedStages={["volume", "brand"]}
      onGoToDashboard={() => {
        alert("Navigating to Merchant Dashboard!");
      }}
    />
  );
}

export default OnboardingNewExample;
