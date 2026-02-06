/**
 * Página de demonstração do editor – mostra o seletor de templates
 * (Colégio Vanguarda e Edvi). Clique em um template para ver dentro do editor.
 * Para ver: npm run demo e abra http://localhost:5173
 */

import React from "react";
import { createRoot } from "react-dom/client";
import { LandingPageEditor } from "./editor/LandingPageEditor";
import "./styles/landing-page.css";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <React.StrictMode>
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-4 py-2">
        <h1 className="text-lg font-semibold text-gray-800">
          SmartGesti Site Editor
        </h1>
        <p className="text-sm text-gray-500">
          Escolha um template (Colégio Vanguarda ou Edvi) para abrir no editor.
        </p>
      </header>
      <main className="p-2">
        <LandingPageEditor />
      </main>
    </div>
  </React.StrictMode>,
);
