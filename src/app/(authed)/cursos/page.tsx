'use client';

import CourseCatalog from '@/app/components/courseCatalog';

export default function CursosPage() {
  return (
    <main className="min-h-screen bg-[#141414]">
      {/* Header */}
      <div className="relative bg-gradient-to-b from-[#141414] to-transparent">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Catálogo de Cursos
          </h1>
          <p className="text-gray-400 text-lg">
            Descubre, aprende y haz crecer tus habilidades
          </p>
        </div>
      </div>

      {/* Catalogo */}
      <div className="container mx-auto px-4 pb-12">
        <CourseCatalog />
      </div>
    </main>
  );
}