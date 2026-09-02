import { Route, Routes } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Overview } from "./pages/Overview";
import { ComponentDetail } from "./pages/ComponentDetail";
import "./App.css";

export function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/components/:slug" element={<ComponentDetail />} />
        </Routes>
      </main>
    </div>
  );
}
