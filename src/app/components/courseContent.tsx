'use client';

import { useState, useEffect, useCallback } from 'react';
import { getFileType, FileType } from '@/utils/fileUtils';
import { useCourseStatus } from '@/app/hooks/useCourseStatus';

interface CourseContentProps {
  id_curso: string;
  titulo: string;
  descripcion: string;
  ruta_archivo: string;
  estado: 'sin_comenzar' | 'en_progreso' | 'completado';
  duracion: number;
  onStatusUpdate?: (nuevo_estado: 'sin_comenzar' | 'en_progreso' | 'completado') => void;
}

const CLOUDFRONT_BASE = 'https://d1vgcfoa2829kr.cloudfront.net';

export default function CourseContent({
  id_curso,
  titulo,
  descripcion,
  ruta_archivo,
  estado,
  duracion,
  onStatusUpdate
}: CourseContentProps) {
    const [fileType, setFileType] = useState<FileType>('unknown');
    const [mediaUrl, setMediaUrl] = useState<string>('');
    const [hasStarted, setHasStarted] = useState(false);
    const { updateCourseStatus, loading, error } = useCourseStatus();
    
    // Evitamos que se recree el handle en cada render
    const handleStatusUpdate = useCallback(async (nuevo_estado: 'sin_comenzar' | 'en_progreso' | 'completado') => {
      try {
        await updateCourseStatus(id_curso, nuevo_estado);
        onStatusUpdate?.(nuevo_estado);
      } catch (err) {
        console.error('Error al actualizar estado:', err);
      }
    }, [id_curso, updateCourseStatus, onStatusUpdate]);
    
    useEffect(() => {
      // Checamos si es un video o un pdf
      const ext = getFileType(ruta_archivo);
      setFileType(ext);

      // Se construye la URL completa
      if (ext === 'video' || ext === 'pdf') {
        setMediaUrl(`${CLOUDFRONT_BASE}/${encodeURIComponent(ruta_archivo)}`);
      } else {
        setMediaUrl('');
      }

      // Marcar como "en_progreso" si el usuario accede al contenido por primera vez
      if (estado === 'sin_comenzar' && !hasStarted) {
        handleStatusUpdate('en_progreso');
        setHasStarted(true);
      }
    }, [ruta_archivo, estado, hasStarted, handleStatusUpdate]);

    const handleFinalize = () => {
      if (estado !== 'completado') {
        handleStatusUpdate('completado');
      }
    };

    const renderContent = () => {
        if (!mediaUrl) {
          return (
            <div className="text-center text-red-500">
              <p>Tipo de archivo no soportado o URL inválida</p>
              <p className="text-sm text-gray-400">Archivo: {ruta_archivo}</p>
            </div>
          );
        }

        if (fileType === 'video') {
            return (
              <div className="w-full max-w-4xl mx-auto border border-gray-400 hover:border-white rounded-lg p-2 transition-colors">
                <video controls className="w-full h-auto rounded-lg shadow-lg"
                  onPlay={() => {
                    if (estado === 'sin_comenzar') {
                      handleStatusUpdate('en_progreso');
                    }
                  }}
                >
                    <source src={mediaUrl} type="video/mp4" />
                </video>
              </div>
            );
        }

        if (fileType === 'pdf') {
            return (
              <div className="w-full max-w-4xl mx-auto border border-gray-400 hover:border-white rounded-lg p-2 transition-colors">
                <iframe src={mediaUrl} className="w-full h-[600px] rounded-lg shadow-lg" title={`PDF - ${titulo}`}/>

                <div className="mt-4 text-center">
                  <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 underline">
                    Abrir PDF en nueva pestaña
                  </a>
                </div>
              </div>
            );
        }
        return null;
    };

return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* Header del curso */}
      <div className="bg-gradient-to-b from-[#141414] to-transparent border-b border-gray-800">
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => window.history.back()} className="flex items-center text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al catálogo
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">{duracion} min</span>
              
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                estado === 'completado' ? 'bg-green-600' :
                estado === 'en_progreso' ? 'bg-yellow-600' : 'bg-gray-600'
              }`}>
                {estado === 'completado' ? 'Completado' :
                 estado === 'en_progreso' ? 'En progreso' : 'Sin comenzar'}
              </span>

            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{titulo}</h1>

          <p className="text-gray-300 text-lg max-w-3xl">{descripcion}</p>
        </div>
      </div>

      {/* Contenido del curso */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          {renderContent()}
        </div>

        {/* Boton de finalizar el curso */}
        {estado !== 'completado' && (
          <div className="text-center">
            <button onClick={handleFinalize} disabled={loading} className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              {loading ? 'Finalizando...' : 'Finalizar Curso'}
            </button>
          </div>
        )}

        {/* Mensaje de completado */}
        {estado === 'completado' && (
          <div className="text-center bg-green-900/30 border border-green-600 rounded-lg p-6">
            <div className="text-green-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-green-400 mb-2">¡Curso Completado!</h3>

            <p className="text-gray-300">Has finalizado exitosamente este curso.</p>
          </div>
        )}

        {error && (
          <div className="text-center bg-red-900/30 border border-red-600 rounded-lg p-4 mt-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        
      </div>
    </div>
  );
}