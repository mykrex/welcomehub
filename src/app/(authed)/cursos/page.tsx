'use client';

import CourseCatalog from '@/app/components/courseCatalog';

export default function CursosPage() {
  return (
    <main className="min-h-screen bg-[#000F14]">
      {/* Header */}
      <div className="relative bg-gradient-to-b from-[#000F14] to-transparent">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Descubre, aprende y haz crecer tus habilidades
          </h1>
        </div>
      </div>

      {/* Catalogo */}
      <div className="container mx-auto px-4 pb-12">
        <CourseCatalog />
      </div>
    </main>
  );
}