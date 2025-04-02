'use client';
import { Clock, Target } from "lucide-react";
import Image from "next/image";

const cursos = [
  { nombre: "Atencion al cliente y ventas", estado: "En Proceso", abierto: "Abierto hoy" },
  { nombre: "Introduccion a excel", estado: "En Proceso", abierto: "Abierto hace 2 dias" },
  { nombre: "Crecimiento corporativo", estado: "Faltante", abierto: "Sin abrir" },
  { nombre: "Tecnicas de trabajo en equipo", estado: "Faltante", abierto: "Sin abrir" },
  { nombre: "Liderazgo y Gestion de Equipos", estado: "Completado", abierto: "Abierto hace 1 semana" },
  { nombre: "Marketing Digital", estado: "En Proceso", abierto: "Abierto hace 3 dias" },
  { nombre: "Programacion Basica", estado: "Completado", abierto: "Abierto hace 5 dias" }
];

const getColor = (estado: string) => {
  switch (estado) {
    case "En Proceso": return "bg-yellow-400";
    case "Faltante": return "bg-red-500";
    case "Completado": return "bg-green-500";
    default: return "bg-gray-500";
  }
};

export default function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#353535] text-white p-5 space-y-5">
        {/* Parte superior sin scroll */}
        <div className="flex flex-col space-y-5">
          <h1 className="text-white font-sf font-semibold text-[40px]">Dashboard</h1>

          <div className="flex flex-col p-[20px] bg-[#141414] rounded-[15px]">
            <span className="text-[#448AFF] font-medium text-[40px]">
              78% <span className="text-[30px] font-normal">completado</span>
            </span>
            <div className="w-full bg-gray-700 h-2 rounded-full mt-2 flex">
              <div className="bg-[#448AFF] h-2 rounded-full" style={{ width: '50%' }}></div>
              <div className="bg-[#06D6A0] h-2 rounded-full" style={{ width: '28%' }}></div>
              <div className="bg-gray-500 h-2 rounded-full flex-1"></div>
            </div>
            <div className="flex justify-center space-x-4 mt-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#448AFF] rounded-full mr-2"></div>
                <span>Completado</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#06D6A0] rounded-full mr-2"></div>
                <span>Hecho hoy</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-500 rounded-full mr-2"></div>
                <span>Restante</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="bg-[#141414] p-6 rounded-lg col-span-2 flex justify-between">
              <div>
                <h3 className="text-xl font-semibold">Retomar mi curso más reciente</h3>
                <h4 className="text-lg font-bold mt-2">Atención al Cliente y Ventas</h4>
                <p className="text-sm text-gray-400 mt-2">
                  Este curso proporciona las habilidades esenciales para interactuar de manera efectiva con los clientes, brindando un servicio de calidad y potenciando las ventas.
                </p>
                <div className="flex mt-4 space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-[30px] h-[4px] bg-[#06D6A0] rounded-full"></div>
                  ))}
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="w-[30px] h-[4px] bg-gray-500 rounded-full"></div>
                  ))}
                </div>
                <div className="text-sm text-green-400 mt-2">3 de 5 módulos completados</div>
              </div>
              <div className="flex flex-col items-center">
              <Image
                  src="/repository_assets/imagencurso.png"
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-lg mb-2 object-cover"
                />
                <button
                  className="px-6 py-4 rounded-lg text-white text-lg font-bold"
                  style={{ background: 'linear-gradient(90deg, #81A9EB 0%, #3E9ADE 100%)' }}
                >
                  Ir a Curso
                </button>
              </div>
            </div>

            <div className="bg-[#141414] p-6 rounded-lg text-center">
              <h4 className="text-[#8A8A8A] text-[20px]">Mi Tiempo Promedio</h4>
              <p className="text-[80px] text-[#F57C00] font-bold leading-none flex items-center justify-center">
                45<span className="text-[20px] font-normal">min</span>
                <Clock className="w-20 h-20 ml-2 text-[#F57C00]" />
              </p>
              <span className="text-[#F57C00] text-[15px] underline">6.7% </span>
              <span className="text-[#8A8A8A] text-[15px]">más </span>
              <span className="text-[#F57C00] font-bold text-[15px]">alto</span>
              <span className="text-[#8A8A8A] text-[15px]"> que el promedio</span>
            </div>

            <div className="bg-[#141414] p-6 rounded-lg text-center">
              <h4 className="text-[#8A8A8A] text-[20px]">Mi Puntaje Promedio</h4>
              <p className="text-[80px] text-[#00C853] font-bold leading-none flex items-center justify-center">
                75<span className="text-[20px] font-normal">%</span>
                <Target className="w-20 h-20 ml-2 text-[#00C853]" />
              </p>
              <span className="text-[#00C853] text-[15px] underline">10.7% </span>
              <span className="text-[#8A8A8A] text-[15px]">más </span>
              <span className="text-[#00C853] font-bold text-[15px]">bajo</span>
              <span className="text-[#8A8A8A] text-[15px]"> que el promedio</span>
            </div>
          </div>
        </div>

        {/* Sección de cursos con scroll */}
        <div className="flex-1 overflow-y-auto max-h-[700px] p-5 bg-[#141414] rounded-[15px]">
          <h2 className="text-[#999] text-[20px] font-normal">Mis Cursos</h2>
          <div className="flex items-center mt-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-[#999]">Curso Asignado</span>
          </div>
          <div className="mt-4 space-y-4">
            {cursos.map((curso, index) => (
              <div key={index} className="bg-[#333] p-5 rounded-[15px] border-b-4 flex justify-between items-center" style={{ borderColor: getColor(curso.estado) }}>
                <div>
                  <h3 className="text-white text-[20px]">{curso.nombre}</h3>
                  <p className="text-[#D9D9D9] text-[12px] font-light">{curso.abierto}</p>
                  <div className="flex space-x-2 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-[30px] h-[4px] rounded-full ${i < 3 ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    ))}
                  </div>
                </div>
                <button className={`px-4 py-2 rounded-full text-white ${getColor(curso.estado)}`}>{curso.estado}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
