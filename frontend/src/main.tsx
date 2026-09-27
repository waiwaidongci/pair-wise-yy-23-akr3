import { useState } from "react";
import { createRoot } from "react-dom/client";
import { routes } from "./router/routes";
import { LearnPage } from "./pages/LearnPage";
import { PracticePage } from "./pages/PracticePage";
import { MistakesPage } from "./pages/MistakesPage";
import { ProgressPage } from "./pages/ProgressPage";
import "./styles.css";

function App() {
  const [active, setActive] = useState<string>("/mistakes");
  return (
    <div className="shell">
      <aside>
        <div className="brand">盲文点字学习训练器</div>
        <nav>
          {routes.map((route) => (
            <button key={route.route} className={active === route.route ? "active" : ""} onClick={() => setActive(route.route)}>
              {route.name}
            </button>
          ))}
        </nav>
      </aside>
      {active === "/learn" ? <LearnPage /> : null}
      {active === "/practice" ? <PracticePage onBack={() => setActive("/mistakes")} /> : null}
      {active === "/mistakes" ? <MistakesPage onEnterPractice={() => setActive("/practice")} /> : null}
      {active === "/progress" ? <ProgressPage /> : null}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
