import { OnboardingNew } from "../OnboardingNew";

export function OnboardingNewExample() {
  return (
    <OnboardingNew
      onGoToDashboard={() => {
        alert("Navigating to Merchant Dashboard!");
      }}
    />
  );
}

export default OnboardingNewExample;
