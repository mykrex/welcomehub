// src/app/page.tsx

"use client";

import CourseCatalog from "@/app/components/courseCatalog";
// Importamos el CSS que acabamos de crear
import "./cursos.css";

export default function CursosPage() {
  return (
    <main className="cursos-main">
      {/* Header */}
      <div className="header">
        <div className="header-container">
          <div className="header-title">
            Mis Cursos: 
          </div>
          <div className="header-subtitle">
            Descubre, aprende y haz crecer tus habilidades
          </div>
        </div>
      </div>

      {/* Catálogo */}
      <div className="catalog-container">
        <CourseCatalog />
      </div>
    </main>
  );
}
