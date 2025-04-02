"use client";
import { Clock, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import "@/app/verCursos/verCursos.css";

import SidebarMenu from "@/app/components/SidebarMenu";
import NavBarMenu from "@/app/components/NavBarMenu";

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
    <div className="app-container">
      <SidebarMenu />

      <div className="page-wrapper">
        <NavBarMenu />

        <div className="main-content">
          <div className="gap-5 flex flex-col">
            <div className="flex flex-col p-[20px] bg-[#042C45] rounded-[15px]">
              <span className="text-[#448AFF] font-medium text-[40px]">
                78% <span className="text-[30px] font-normal">completado</span>
              </span>
              <div className="w-full bg-gray-700 h-2 rounded-full mt-2 flex">
                <div
                  className="bg-[#448AFF] h-2 rounded-full"
                  style={{ width: "50%" }}
                ></div>
                <div
                  className="bg-[#06D6A0] h-2 rounded-full"
                  style={{ width: "28%" }}
                ></div>
                <div className="bg-gray-500 h-2 rounded-full flex-1"></div>
              </div>
              <div className="flex justify-center space-x-4 mt-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#448AFF] rounded-full mr-2"></div>
                  <div className="legend-label">Completado</div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#06D6A0] rounded-full mr-2"></div>
                  <div className="legend-label">Hecho Hoy</div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-500 rounded-full mr-2"></div>
                  <div className="legend-label">Restante</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
              <div className="bg-[#042C45] p-6 rounded-lg col-span-2 flex justify-between">
                <div>
                  <h3 className="card-title">Retomar mi curso más reciente:</h3>
                  <h4 className="course-title">Atención al Cliente y Ventas</h4>
                  <p className="text-sm text-gray-400 mt-2">
                    Este curso proporciona las habilidades esenciales para
                    interactuar de manera efectiva con los clientes, brindando
                    un servicio de calidad y potenciando las ventas.
                  </p>
                  <div className="flex mt-4 space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-[30px] h-[4px] bg-[#06D6A0] rounded-full"
                      ></div>
                    ))}
                    {[...Array(2)].map((_, i) => (
                      <div
                        key={i}
                        className="w-[30px] h-[4px] bg-gray-500 rounded-full"
                      ></div>
                    ))}
                  </div>
                  <div className="text-sm text-green-400 mt-2">
                    3 de 5 módulos completados
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <Image
                    src="/imagencurso.png"
                    alt="Curso"
                    width={100}
                    height={100}
                    className="rounded-lg mb-2 object-cover"
                  />
                  <Link href="/verCursos">
                    <button
                      className="px-6 py-4 rounded-lg text-white text-lg font-bold"
                      style={{
                        background:
                          "linear-gradient(90deg, #81A9EB 0%, #3E9ADE 100%)",
                      }}
                    >
                      Ir a Curso
                    </button>
                  </Link>
                </div>
              </div>

              <div className="score-card">
                <div className="flex flex-col items-start w-full h-full justify-between">
                  {/* Title */}
                  <h4 className="card-title text-[#8A8A8A] text-[20px] font-semibold">
                    Mi Tiempo Promedio
                  </h4>

                  {/* Main Score */}
                  <div className="flex items-center justify-between w-full mt-2">
                    <div className="flex items-baseline">
                      <span className="text-[80px] text-[#F57C00] font-bold leading-none">
                        45
                      </span>
                      <span className="text-[20px] text-[#F57C00] font-normal ml-1">
                        min
                      </span>
                    </div>
                    <Clock className="w-20 h-20 text-[#F57C00]" />
                  </div>

                  {/* Comparison Text */}
                  <div className="flex items-center mt-2 text-[15px]">
                    <span className="text-[#F57C00] underline mr-1">6.7%</span>
                    <span className="text-[#8A8A8A] mr-1">más</span>
                    <span className="text-[#F57C00] font-bold mr-1">alto</span>
                    <span className="text-[#8A8A8A]">que el promedio</span>
                  </div>
                </div>
              </div>

              <div className="score-card">
                <div className="flex flex-col items-start w-full h-full justify-between">
                  {/* Title */}
                  <h4 className="card-title text-[#00C853] text-[20px] font-semibold">
                    Mi Puntaje Promedio
                  </h4>

                  {/* Main Score */}
                  <div className="flex items-center justify-between w-full mt-2">
                    <div className="flex items-baseline">
                      <span className="text-[80px] text-[#00C853] font-bold leading-none">
                        75
                      </span>
                      <span className="text-[20px] text-[#00C853] font-normal ml-1">
                        %
                      </span>
                    </div>
                    <Target className="w-20 h-20 text-[#00C853]" />
                  </div>

                  {/* Comparison Text */}
                  <div className="flex items-center mt-2 text-[15px]">
                    <span className="text-[#00C853] underline mr-1">10.8%</span>
                    <span className="text-[#8A8A8A] mr-1">más</span>
                    <span className="text-[#00C853] font-bold mr-1">bajo</span>
                    <span className="text-[#8A8A8A]">que el promedio</span>
                  </div>
                </div>
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
      </div>
    </div>
  );
}
