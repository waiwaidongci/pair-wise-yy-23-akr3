import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { routes } from "./router/routes";
import { LearnPage } from "./pages/LearnPage";
import { PracticePage } from "./pages/PracticePage";
import { MistakesPage } from "./pages/MistakesPage";
import { MistakePracticePage } from "./pages/MistakePracticePage";
import { ProgressPage } from "./pages/ProgressPage";
import "./styles.css";

function currentPath(): string {
  const hash = window.location.hash.replace(/^#/, "");
  return hash || routes[0]?.route || "/learn";
}

function renderPage(path: string) {
  if (path === "/learn") return <LearnPage />;
  if (path === "/practice") return <PracticePage />;
  if (path.startsWith("/mistakes/practice")) return <MistakePracticePage />;
  if (path === "/mistakes") return <MistakesPage />;
  if (path === "/progress") return <ProgressPage />;
  return <LearnPage />;
}

function isActive(path: string, route: string): boolean {
  if (route === "/mistakes") return path === "/mistakes" || path.startsWith("/mistakes/practice");
  return path === route;
}

function App() {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const onHashChange = () => setPath(currentPath());
    window.addEventListener("hashchange", onHashChange);
    if (!window.location.hash) window.location.hash = path;
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [path]);

  return (
    <div className="shell">
      <aside>
        <div className="brand">盲文点字学习训练器</div>
        <nav>
          {routes.map((route) => (
            <a
              key={route.route}
              href={"#" + route.route}
              className={isActive(path, route.route) ? "active" : ""}
            >
              {route.name}
            </a>
          ))}
        </nav>
      </aside>
      {renderPage(path)}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
