import { Onboarding } from "../onboarding";

export function OnboardingExample() {
  return (
    <Onboarding
      onGoToDashboard={() => {
        alert("Redirect to Revenue Dashboard");
      }}
      onExit={() => {
        alert("Exit onboarding setup");
      }}
    />
  );
}

export default OnboardingExample;
