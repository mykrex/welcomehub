"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import SidebarMenu from "@/app/components/(layout)/SidebarMenu";
import NavBarMenu from "@/app/components/(layout)/NavBarMenu";
import "@/app/verCursos/verCursos.css";

interface Curso {
  titulo: string;
  descripcion: string;
  tareasTotales: number;
  tareasCompletadas: number;
  imagen: string;
}

const cursosAsignados: Curso[] = [
  {
    titulo: "Estrategias de Venta Avanzadas",
    descripcion:
      "Domina técnicas de persuasión y negociación para cerrar más ventas. Aprende a identificar necesidades y ofrecer soluciones efectivas.",
    tareasTotales: 6,
    tareasCompletadas: 3,
    imagen: "/imagen1.jpg",
  },
  {
    titulo: "Gestión del Tiempo y Productividad",
    descripcion:
      "Aprende a organizar tus tareas diarias de manera eficiente. Reduce el estrés y aumenta tu rendimiento con estrategias probadas.",
    tareasTotales: 5,
    tareasCompletadas: 2,
    imagen: "/imagen2.jpg",
  },
  {
    titulo: "Liderazgo en la Nueva Era",
    descripcion:
      "Desarrolla habilidades para liderar equipos en entornos cambiantes. Fomenta la innovación y la motivación en tu equipo.",
    tareasTotales: 8,
    tareasCompletadas: 4,
    imagen: "/imagen3.jpg",
  },
  {
    titulo: "Trabajo en Equipo y Resolución de Conflictos",
    descripcion:
      "Aprende estrategias para mejorar la comunicación y el desempeño del equipo. Domina técnicas para manejar conflictos de manera efectiva.",
    tareasTotales: 6,
    tareasCompletadas: 5,
    imagen: "/imagen4.jpg",
  },
];

const cursosOpcionales: Curso[] = [
  {
    titulo: "Dominando Excel desde Cero",
    descripcion:
      "Aprende desde lo básico hasta funciones avanzadas de Excel. Mejora tu productividad y precisión en el manejo de datos.",
    tareasTotales: 5,
    tareasCompletadas: 1,
    imagen: "/imagen7.jpg",
  },
  {
    titulo: "Fundamentos de Programación en Python",
    descripcion:
      "Descubre los principios básicos de programación con Python. Aprende a escribir código eficiente y estructurado.",
    tareasTotales: 6,
    tareasCompletadas: 3,
    imagen: "/imagen8.jpg",
  },
];

const cursosRecomendados: Curso[] = [
  {
    titulo: "Gestión de Proyectos Ágiles",
    descripcion:
      "Aprende metodologías ágiles como Scrum y Kanban para gestionar proyectos de manera eficiente. Optimiza tiempos y mejora la entrega de resultados.",
    tareasTotales: 6,
    tareasCompletadas: 2,
    imagen: "/imagen10.jpg",
  },
  {
    titulo: "Ventas y Atención al Cliente",
    descripcion:
      "Domina las mejores prácticas para atender clientes y cerrar ventas. Mejora la experiencia del cliente y fideliza compradores.",
    tareasTotales: 5,
    tareasCompletadas: 3,
    imagen: "/imagen11.jpg",
  },
];

export default function CursosDashboard() {
  const [indexAsignados, setIndexAsignados] = useState(0);
  const [indexOpcionales, setIndexOpcionales] = useState(0);
  const [indexRecomendados, setIndexRecomendados] = useState(0);
  const router = useRouter();

  const mover = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    lista: Curso[],
    direccion: number
  ) => {
    setter((prev) => {
      const maxIndex = Math.floor((lista.length - 1) / 2);
      const next = prev + direccion;
      return Math.max(0, Math.min(next, maxIndex));
    });
  };

  const renderizarCursos = (lista: Curso[], indice: number) => (
    <div className="flex gap-6 mt-4 transition-transform duration-300">
      {[0, 1].map((i) => {
        const curso = lista[indice * 2 + i];
        if (!curso) return null;

        return (
          <div
            key={curso.titulo}
            className="w-[500px] h-52 border-4 rounded-2xl flex items-center cursor-pointer"
            style={{ borderColor: "#06D6A0", backgroundColor: "#141414" }}
            onClick={() => router.push("/cursos/verCurso")}
          >
            <div className="flex-1 p-3">
              <div style={{ color: "white", fontSize: 20, fontWeight: "500" }}>
                {curso.titulo}
              </div>
              <div style={{ color: "#999", fontSize: 12 }}>
                {curso.descripcion}
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-[#06D6A0]">
                {curso.tareasCompletadas} de {curso.tareasTotales}
                <span className="text-[#999]"> módulos completados</span>
              </div>
              <div className="flex gap-2 mt-2 w-60">
                {Array.from({ length: curso.tareasTotales }, (_, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 h-1 rounded-full ${
                      idx < curso.tareasCompletadas
                        ? "bg-[#06D6A0]"
                        : "bg-gray-500"
                    }`}
                  />
                ))}
              </div>
            </div>
            <Image
              src={curso.imagen}
              alt={curso.titulo}
              width={50}
              height={50}
              className="object-cover rounded-xl ml-auto"
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="main-content">
      {/*}
          <div className="flex justify-between alignment mb-6">
            <a href="https://www.nintendo.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <div className="bg-teal-600 text-white w-60 h-12 flex flex-col justify-center rounded-l-full pl-4">
                <span className="text-[#333] text-sm">Sigue aprendiendo</span>
                <span className="text-white font-bold">Entrar a Global Campus</span>
              </div>
              <div className="bg-white text-gray-900 w-30 h-12 flex flex-col justify-center rounded-r-full pl-2">
                <span className="text-[#333] font-light">Global</span>
                <span className="text-[#333] font-bold">Campus</span>
              </div>
            </a>
          </div>
          */}

      {[
        {
          titulo: "Mis Cursos Asignados",
          lista: cursosAsignados,
          indice: indexAsignados,
          setIndice: setIndexAsignados,
        },
        {
          titulo: "Mis Cursos Opcionales",
          lista: cursosOpcionales,
          indice: indexOpcionales,
          setIndice: setIndexOpcionales,
        },
        {
          titulo: "Mis Cursos Recomendados",
          lista: cursosRecomendados,
          indice: indexRecomendados,
          setIndice: setIndexRecomendados,
        },
      ].map(({ titulo, lista, indice, setIndice }) => (
        <div key={titulo} className="bg-[#141414] p-4 rounded-lg w-full mt-8">
          <h3 className="text-[#999999] text-lg font-semibold">{titulo}</h3>
          {renderizarCursos(lista, indice)}
          <div className="flex items-center justify-between mt-4">
            <button
              className="p-2 bg-[#141414] rounded-full"
              onClick={() => mover(setIndice, lista, -1)}
            >
              <ChevronLeft />
            </button>
            <div className="flex items-center">
              {Array.from({ length: Math.ceil(lista.length / 2) }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full mx-1 ${
                    i === indice ? "bg-[#636364]" : "bg-[#D9D9D9]"
                  }`}
                ></div>
              ))}
            </div>
            <button
              className="p-2 bg-[#141414] rounded-full"
              onClick={() => mover(setIndice, lista, 1)}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
