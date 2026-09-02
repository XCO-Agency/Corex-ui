import { Route, Routes } from "react-router-dom";
import { Overview } from "./pages/Overview";
import { ComponentDetail } from "./pages/ComponentDetail";
import Layout from "./layout";

export function App() {
  return (
    <Layout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/components/:slug" element={<ComponentDetail />} />
        </Routes>
    </Layout>
  );
}
