import { Route, Routes } from "react-router-dom";
import { Overview } from "./pages/Overview";
import { Installation } from "./pages/Installation";
import { ComponentDetail } from "./pages/ComponentDetail";
import Layout from "./layout";
import { TooltipProvider } from "./components/ui/tooltip";

export function App() {
  return (
    <TooltipProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/installation" element={<Installation />} />
          <Route path="/components/:slug" element={<ComponentDetail />} />
          <Route path="/blocks/:slug" element={<ComponentDetail />} />
        </Routes>
      </Layout>
    </TooltipProvider>
  );
}
