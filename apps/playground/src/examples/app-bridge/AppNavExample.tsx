import { AppNav, Link } from "@xco/corex-ui";

export function AppNavExample() {
  return (
    <AppNav>
      <Link url="/app" removeUnderline>
        Home
      </Link>
      <Link url="/app/templates">Templates</Link>
      <Link url="/app/settings">Settings</Link>
    </AppNav>
  );
}
