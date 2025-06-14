"use client";

import { useState, useEffect, useCallback } from "react";
import { getFileType, FileType } from "@/utils/fileUtils";
import { useCourseStatus } from "@/app/hooks/useCourseStatus";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface CourseContentProps {
  id_curso: string;
  titulo: string;
  descripcion: string;
  ruta_archivo: string;
  estado: "sin_comenzar" | "en_progreso" | "completado";
  duracion: number;
  obligatorio: boolean;
  onStatusUpdate?: (
    nuevo_estado: "sin_comenzar" | "en_progreso" | "completado"
  ) => void;
}

const CLOUDFRONT_BASE = "https://d1vgcfoa2829kr.cloudfront.net";

export default function CourseContent({
  id_curso,
  titulo,
  descripcion,
  ruta_archivo,
  estado,
  duracion,
  obligatorio,
  onStatusUpdate,
}: CourseContentProps) {
  const [fileType, setFileType] = useState<FileType>("unknown");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [hasStarted, setHasStarted] = useState(false);
  const { updateCourseStatus, loading, error } = useCourseStatus();
  const supabase = createClientComponentClient();

  const isObligatorio = obligatorio === true;

  const handleStatusUpdate = useCallback(
    async (nuevo_estado: "sin_comenzar" | "en_progreso" | "completado") => {
      try {
        await updateCourseStatus(id_curso, nuevo_estado);
        onStatusUpdate?.(nuevo_estado);
      } catch (err) {
        console.error("Error al actualizar estado:", err);
      }
    },
    [id_curso, updateCourseStatus, onStatusUpdate]
  );

  useEffect(() => {
    const ext = getFileType(ruta_archivo);
    setFileType(ext);
    if (ext === "video" || ext === "pdf") {
      setMediaUrl(`${CLOUDFRONT_BASE}/${encodeURIComponent(ruta_archivo)}`);
    } else {
      setMediaUrl("");
    }
    if (estado === "sin_comenzar" && !hasStarted) {
      handleStatusUpdate("en_progreso");
      setHasStarted(true);
    }
  }, [ruta_archivo, estado, hasStarted, handleStatusUpdate]);

  const handleFinalize = () => {
    if (estado !== "completado") {
      handleStatusUpdate("completado");
    }
  };

  const handleUnenroll = async () => {
    if (isObligatorio) {
      alert("No puedes desinscribirte de un curso obligatorio.");
      return;
    }

    const confirmed = window.confirm(
      "¿Estás seguro de que quieres desinscribirte? Esto borrará todo tu progreso."
    );
    if (!confirmed) return;

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("No autorizado");

      const { error } = await supabase
        .from("curso_usuario")
        .delete()
        .match({ id_usuario: user.id, id_curso });

      if (error) throw error;

      alert("Te has desinscrito del curso.");
      window.location.href = "/cursos";
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        alert(`Error al desinscribirte: ${err.message}`);
      } else {
        console.error(err);
        alert("Error al desinscribirte.");
      }
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

    if (fileType === "video") {
      return (
        <div className="bg-[#1a242a] w-full max-w-4xl mx-auto border border-gray-400 hover:border-white rounded-lg p-2 transition-colors">
          <video
            controls
            className="w-full h-auto rounded-lg shadow-lg"
            onPlay={() => {
              if (estado === "sin_comenzar") {
                handleStatusUpdate("en_progreso");
              }
            }}
          >
            <source src={mediaUrl} type="video/mp4" />
          </video>
        </div>
      );
    }

    if (fileType === "pdf") {
      return (
        <div className="w-full max-w-4xl mx-auto border border-gray-400 hover:border-white rounded-lg p-2 transition-colors">
          <iframe
            src={mediaUrl}
            className="w-full h-[600px] rounded-lg shadow-lg"
            title={`PDF - ${titulo}`}
          />
          <div className="mt-4 text-center">
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 underline"
            >
              Abrir PDF en nueva pestaña
            </a>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#042c45] text-white">
      <div className="bg-gradient-to-b from-[#042c45] to-transparent border-b border-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">{duracion} min</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  estado === "completado"
                    ? "bg-[#3faa49]"
                    : estado === "en_progreso"
                    ? "bg-[#eba10e]"
                    : "bg-gray-600"
                }`}
              >
                {estado === "completado"
                  ? "Completado"
                  : estado === "en_progreso"
                  ? "En progreso"
                  : "Sin comenzar"}
              </span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{titulo}</h1>
          <p className="text-gray-300 text-lg max-w-3xl">{descripcion}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">{renderContent()}</div>

        {estado !== "completado" && (
          <div className="text-center">
            <button
              onClick={handleFinalize}
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {loading ? "Finalizando..." : "Finalizar Curso"}
            </button>
          </div>
        )}

        {estado === "completado" && (
          <div className="text-center bg-green-900/30 border border-green-600 rounded-lg p-6">
            <div className="text-green-400 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-400 mb-2">
              ¡Curso Completado!
            </h3>
            <p className="text-gray-300">
              Has finalizado exitosamente este curso.
            </p>
          </div>
        )}

        {!isObligatorio && (
          <div className="text-center mt-4">
            <button
              onClick={handleUnenroll}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Desinscribirme del curso
            </button>
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
