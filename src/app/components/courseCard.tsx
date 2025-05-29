'use client';

import Image from "next/image";

interface CourseCardProps {
  id_curso: string;
  titulo: string;
  descripcion: string;
  portada: string;
  duracion: number;
  obligatorio?: boolean;
  estado?: 'sin_comenzar' | 'en_progreso' | 'completado';
  showObligatory?: boolean;
  onClick?: () => void;
}

export default function CourseCard({ 
  titulo, 
  descripcion, 
  portada, 
  duracion, 
  obligatorio,
  estado,
  showObligatory = false,
  onClick 
}: CourseCardProps) {
  const getEstadoColor = (estado?: string) => {
    switch (estado) { /** Se cambia el color del estado segun el estado */
      case 'completado': return 'bg-green-500';
      case 'en_progreso': return 'bg-yellow-500';
      case 'sin_comenzar': return 'bg-gray-500';
      default: return '';
    }
  };

  const getEstadoTexto = (estado?: string) => {
    switch (estado) { /** Acomodamos el estado bien formateado */
      case 'completado': return 'Completado';
      case 'en_progreso': return 'En progreso';
      case 'sin_comenzar': return 'Sin comenzar';
      default: return '';
    }
  };

  return (
    <div onClick={onClick} className="flex-shrink-0 w-80 bg-[#181818] rounded-lg overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:z-10">
      <div className="relative">
        <Image src={portada} alt={titulo} width={400} height={192} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="w-full h-48 object-cover"/>
        
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {estado && (
            <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getEstadoColor(estado)}`}>
              {getEstadoTexto(estado)}
            </div>
          )}
        </div>

      </div>
      
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
          {titulo}
        </h3>

        <p className="text-gray-400 text-sm mb-3 line-clamp-3">
          {descripcion}
        </p>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{duracion} min</span>

          {!estado && <span>Disponible</span>}
          {showObligatory && obligatorio && (
            <div className="bg-cyan-600 px-2 py-1 rounded-full text-xs font-medium text-white">
              Obligatorio
            </div>
          )}

        </div>
      </div>
    </div>
  );
}