import { Route, Routes } from "react-router-dom";
import { Overview } from "./pages/Overview";
import { Installation } from "./pages/Installation";
import { Icons } from "./pages/Icons";
import { AppsIcons } from "./pages/AppsIcons";
import { Utils } from "./pages/Utils";
import { ComponentDetail } from "./pages/component-detail/ComponentDetail";
import { ThumbnailCapture } from "./pages/ThumbnailCapture";
import { Editor } from "./pages/editor";
import Layout from "./layout";
import { TooltipProvider } from "./components/ui/tooltip";

export function App() {
  return (
    <TooltipProvider>
      <Routes>
        {/* The editor is a full-screen workspace, outside the docs shell. */}
        <Route path="/editor" element={<Editor />} />
        {/* Chrome-free capture surface for Overview thumbnail screenshots. */}
        <Route path="/_capture/:slug" element={<ThumbnailCapture />} />
        <Route path="*" element={<DocsRoutes />} />
      </Routes>
    </TooltipProvider>
  );
}

function DocsRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/installation" element={<Installation />} />
        <Route path="/icons" element={<Icons />} />
        <Route path="/apps-icons" element={<AppsIcons />} />
        <Route path="/app-icons" element={<AppsIcons />} />
        <Route path="/utils" element={<Utils />} />
        <Route path="/utils/:slug" element={<Utils />} />
        <Route path="/components/:slug" element={<ComponentDetail />} />
        <Route path="/blocks/:slug" element={<ComponentDetail />} />
      </Routes>
    </Layout>
  );
}
