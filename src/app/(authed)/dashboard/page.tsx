"use client";

//Assets
import { Clock } from "lucide-react";
import AverageStats from "./assets/AverageStats";
import ProgressBar from "./assets/ProgressBar";
import RecentCourse from "./assets/RecentCourse";

//Styles
import "@/app/(authed)/cursos/verCursos.css"; //TODO: QUITAR
import "@/app/components/(layout)/layout.css"; //Unico que lo usa -> main-content
import "./dashboard.css";

const cursos = [
  {
    nombre: "Atencion al cliente y ventas",
    estado: "En Proceso",
    abierto: "Abierto hoy",
  },
  {
    nombre: "Introduccion a excel",
    estado: "En Proceso",
    abierto: "Abierto hace 2 dias",
  },
  {
    nombre: "Crecimiento corporativo",
    estado: "Faltante",
    abierto: "Sin abrir",
  },
  {
    nombre: "Tecnicas de trabajo en equipo",
    estado: "Faltante",
    abierto: "Sin abrir",
  },
  {
    nombre: "Liderazgo y Gestion de Equipos",
    estado: "Completado",
    abierto: "Abierto hace 1 semana",
  },
  {
    nombre: "Marketing Digital",
    estado: "En Proceso",
    abierto: "Abierto hace 3 dias",
  },
  {
    nombre: "Programacion Basica",
    estado: "Completado",
    abierto: "Abierto hace 5 dias",
  },
];

const getColor = (estado: string) => {
  switch (estado) {
    case "En Proceso":
      return "bg-yellow-400";
    case "Faltante":
      return "bg-red-500";
    case "Completado":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

export default function Dashboard() {
  return (
    <div className="main-content">
      <div className="dashboard-wrapper">
        <ProgressBar />

        <div className="row-one">
          {/* Recent Course - 3/5 */}
          <div className="recent-course-wrapper">
            <RecentCourse />
          </div>

          {/* Stats - 2/5 */}
          <div className="column-one-stats">
            <AverageStats
              title="Mi Puntaje Promedio"
              value={45}
              unit="%"
              icon={Clock}
              comparison={{
                percent: "6.7%",
                position: "más",
                direction: "alto",
                color: "#51B6F6",
              }}
            />

            <AverageStats
              title="Mis Cursos Completados"
              value={3}
              unit="de 7"
              icon={Clock}
              comparison={{
                percent: "20%",
                position: "más",
                direction: "alto",
                color: "#51B6F6",
              }}
            />
          </div>
        </div>

        {/* Mis Cursos */}
        <div className=" flex-1 overflow-y-auto max-h-[700px] p-5 bg-[#042C45] rounded-[15px]">
          <div className="progress-header">
            <div className="progress-title">Mis Cursos</div>
          </div>
          <div className="mt-4 space-y-4">
            {cursos.map((curso, index) => (
              <div
                key={index}
                className="bg-[#333] p-5 rounded-[15px] border-b-4 flex justify-between items-center"
                style={{ borderColor: getColor(curso.estado) }}
              >
                <div>
                  <h3 className="text-white text-[20px]">{curso.nombre}</h3>
                  <p className="text-[#D9D9D9] text-[12px] font-light">
                    {curso.abierto}
                  </p>
                  <div className="flex space-x-2 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-[30px] h-[4px] rounded-full ${
                          i < 3 ? "bg-green-500" : "bg-gray-500"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
                <button
                  className={`px-4 py-2 rounded-full text-white ${getColor(
                    curso.estado
                  )}`}
                >
                  {curso.estado}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
