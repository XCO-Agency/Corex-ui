import { useRef } from "react";
import { AppNav, AppWindow, Badge, Button, Link, Menu, Page, SaveBar, useSaveBar, useToast } from "@xco/corex-ui";
import type { ComponentEntry } from "../types";

function AppWindowExample() {
  const windowRef = useRef<HTMLElementTagNameMap["s-app-window"]>(null);
  return (
    <>
      <Button onClick={() => windowRef.current?.show()}>Show App Window</Button>{" "}
      <Button onClick={() => windowRef.current?.hide()}>Hide App Window</Button>
      <AppWindow ref={windowRef} src="/app-window-content.html" />
    </>
  );
}

function AppWindowTitleBarExample() {
  return (
    <Page title="Edit Product">
      <Badge slot="accessory" tone="warning">
        Draft
      </Badge>
      <Button slot="primary-action">Save</Button>
    </Page>
  );
}

function AppNavExample() {
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

function MenuInTitleBarExample() {
  return (
    <Page title="Product Details">
      <Button slot="primary-action" icon="save">
        Save
      </Button>
      <Button slot="secondary-actions" commandFor="app-bridge-actions-menu" icon="menu">
        More actions
      </Button>
      <Menu id="app-bridge-actions-menu">
        <Button icon="duplicate">Duplicate</Button>
        <Button icon="archive">Archive</Button>
        <Button icon="delete" destructive>
          Delete
        </Button>
      </Menu>
    </Page>
  );
}

function ToastExample() {
  const toast = useToast();
  return <Button onClick={() => toast.show("Saved")}>Save</Button>;
}

function SaveBarExample() {
  const saveBar = useSaveBar();
  return (
    <SaveBar id="playground-save-bar">
      <button type="button" onClick={() => saveBar.hide("playground-save-bar")}>
        Save
      </button>
      <button type="button" onClick={() => saveBar.hide("playground-save-bar")}>
        Discard
      </button>
    </SaveBar>
  );
}

export const appBridgeComponents: ComponentEntry[] = [
  {
    name: "AppWindow",
    slug: "app-window",
    category: "App Bridge",
    description: "Loads another page in an embedded window, shown/hidden via ref or command/commandFor.",
    requiresEmbeddedContext: true,
    examples: [
      {
        title: "Imperative show/hide via ref",
        Example: AppWindowExample,
        code: `const windowRef = useRef<HTMLElementTagNameMap["s-app-window"]>(null);

<Button onClick={() => windowRef.current?.show()}>Show App Window</Button>
<Button onClick={() => windowRef.current?.hide()}>Hide App Window</Button>
<AppWindow ref={windowRef} src="/app-window-content.html" />`,
      },
      {
        title: "Declarative trigger (no JS)",
        Example: () => (
          <>
            <Button command="--show" commandFor="app-window-declarative">
              Open App Window
            </Button>{" "}
            <Button command="--hide" commandFor="app-window-declarative">
              Close App Window
            </Button>
            <AppWindow id="app-window-declarative" src="/app-window-content.html" />
          </>
        ),
        code: `<AppWindow id="app-window" src="/app-window-content.html" />
<Button command="--show" commandFor="app-window">Open App Window</Button>
<Button command="--hide" commandFor="app-window">Close App Window</Button>`,
      },
      {
        title: "Title bar accessory + menu (inside the window's content page)",
        Example: AppWindowTitleBarExample,
        code: `// Rendered by the page AppWindow's \`src\` loads:
<Page title="Edit Product">
  <Badge slot="accessory" tone="warning">Draft</Badge>
  <Button slot="primary-action">Save</Button>
</Page>`,
      },
    ],
  },
  {
    name: "AppNav",
    slug: "app-nav",
    category: "App Bridge",
    description: "The embedded app's top-level navigation bar.",
    requiresEmbeddedContext: true,
    examples: [
      {
        title: "Nav links",
        Example: AppNavExample,
        code: `<AppNav>
  <Link url="/app" removeUnderline>Home</Link>
  <Link url="/app/templates">Templates</Link>
  <Link url="/app/settings">Settings</Link>
</AppNav>`,
      },
    ],
  },
  {
    name: "Menu (title bar)",
    slug: "app-bridge-menu",
    category: "App Bridge",
    description: "A secondary-actions Menu placed in a Page's title bar, opened via commandFor.",
    requiresEmbeddedContext: true,
    examples: [
      {
        title: "Title bar icons and menu",
        Example: MenuInTitleBarExample,
        code: `<Page title="Product Details">
  <Button slot="primary-action" icon="save">Save</Button>
  <Button slot="secondary-actions" commandFor="actions-menu" icon="menu">More actions</Button>
  <Menu id="actions-menu">
    <Button icon="duplicate">Duplicate</Button>
    <Button icon="archive">Archive</Button>
    <Button icon="delete" destructive>Delete</Button>
  </Menu>
</Page>`,
      },
    ],
  },
  {
    name: "Toast",
    slug: "toast",
    category: "App Bridge",
    description: "A brief, non-blocking confirmation message, shown via the useToast() hook.",
    requiresEmbeddedContext: true,
    examples: [
      {
        title: "Show a toast",
        Example: ToastExample,
        code: `const toast = useToast();

<Button onClick={() => toast.show("Saved")}>Save</Button>`,
      },
    ],
  },
  {
    name: "SaveBar",
    slug: "save-bar",
    category: "App Bridge",
    description: "A persistent bar prompting the merchant to save or discard unsaved changes.",
    requiresEmbeddedContext: true,
    examples: [
      {
        title: "Save bar with useSaveBar()",
        Example: SaveBarExample,
        code: `const saveBar = useSaveBar();

<SaveBar id="modal-save-bar">
  <button onClick={handleSave}>Save</button>
  <button onClick={() => saveBar.hide("modal-save-bar")}>Discard</button>
</SaveBar>`,
      },
      {
        title: "Same-page form (no wrapper needed)",
        Example: () => (
          <form data-save-bar data-discard-confirmation>
            <p style={{ margin: 0, fontSize: 13, color: "#6d7175" }}>
              Add <code>data-save-bar</code> / <code>data-discard-confirmation</code> directly to
              a native &lt;form&gt; — no component needed.
            </p>
          </form>
        ),
        code: `<form data-save-bar data-discard-confirmation>
  <TextField label="Store Name" name="storeName" required />
  <TextField label="Description" name="description" multiline />
  <Checkbox label="Enable notifications" name="notifications" />
</form>`,
      },
    ],
  },
];
