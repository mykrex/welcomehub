'use client';

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, User, Bell, Search } from "lucide-react";
import { useRouter } from 'next/navigation';
import Image from "next/image";

interface Curso {
  titulo: string;
  descripcion: string;
  tareasTotales: number;
  tareasCompletadas: number;
  imagen: string;
}

const cursosAsignados: Curso[] = [ 
  { titulo: "Estrategias de Venta Avanzadas", descripcion: "Domina técnicas de persuasión y negociación para cerrar más ventas. Aprende a identificar necesidades y ofrecer soluciones efectivas.", tareasTotales: 6, tareasCompletadas: 3, imagen: "/imagen1.jpg" },
  { titulo: "Gestión del Tiempo y Productividad", descripcion: "Aprende a organizar tus tareas diarias de manera eficiente. Reduce el estrés y aumenta tu rendimiento con estrategias probadas.", tareasTotales: 5, tareasCompletadas: 2, imagen: "/imagen2.jpg" },
  { titulo: "Liderazgo en la Nueva Era", descripcion: "Desarrolla habilidades para liderar equipos en entornos cambiantes. Fomenta la innovación y la motivación en tu equipo.", tareasTotales: 8, tareasCompletadas: 4, imagen: "/imagen3.jpg" },
  { titulo: "Trabajo en Equipo y Resolución de Conflictos", descripcion: "Aprende estrategias para mejorar la comunicación y el desempeño del equipo. Domina técnicas para manejar conflictos de manera efectiva.", tareasTotales: 6, tareasCompletadas: 5, imagen: "/imagen4.jpg" },
  { titulo: "Estrategias de Negociación", descripcion: "Descubre cómo cerrar acuerdos beneficiosos para ambas partes. Aprende a manejar objeciones y a crear relaciones comerciales sólidas.", tareasTotales: 4, tareasCompletadas: 2, imagen: "/imagen5.jpg"},
  { titulo: "Inteligencia Emocional en el Trabajo", descripcion: "Potencia tus habilidades interpersonales y de liderazgo mediante la inteligencia emocional. Aprende a manejar el estrés y mejorar tu desempeño.", tareasTotales: 7, tareasCompletadas: 4, imagen: "/imagen6.jpg" },
];

const cursosOpcionales: Curso[] = [
  { titulo: "Dominando Excel desde Cero", descripcion: "Aprende desde lo básico hasta funciones avanzadas de Excel. Mejora tu productividad y precisión en el manejo de datos.", tareasTotales: 5, tareasCompletadas: 1, imagen: "/imagen7.jpg" },
  { titulo: "Fundamentos de Programación en Python", descripcion: "Descubre los principios básicos de programación con Python. Aprende a escribir código eficiente y estructurado.", tareasTotales: 6, tareasCompletadas: 3, imagen: "/imagen8.jpg" },
  { titulo: "Marketing Digital y Redes Sociales", descripcion: "Desarrolla estrategias de marketing efectivas en plataformas digitales. Aprende sobre publicidad pagada, SEO y engagement.", tareasTotales: 4, tareasCompletadas: 2, imagen: "/imagen9.jpg" },
];

const cursosRecomendados: Curso[] = [
  { titulo: "Gestión de Proyectos Ágiles", descripcion: "Aprende metodologías ágiles como Scrum y Kanban para gestionar proyectos de manera eficiente. Optimiza tiempos y mejora la entrega de resultados.", tareasTotales: 6, tareasCompletadas: 2, imagen: "/imagen10.jpg" },
  { titulo: "Ventas y Atención al Cliente", descripcion: "Domina las mejores prácticas para atender clientes y cerrar ventas. Mejora la experiencia del cliente y fideliza compradores.", tareasTotales: 5, tareasCompletadas: 3, imagen: "/imagen11.jpg" },
  { titulo: "Comunicación Persuasiva y Asertiva", descripcion: "Mejora tu capacidad de expresión verbal y escrita. Aprende a comunicarte de forma clara y convincente en cualquier situación.", tareasTotales: 4, tareasCompletadas: 3, imagen: "/imagen12.jpg" },
  { titulo: "Análisis de Datos para Negocios", descripcion: "Domina herramientas de análisis de datos para tomar decisiones estratégicas. Aprende a interpretar métricas y optimizar procesos.", tareasTotales: 8, tareasCompletadas: 6, imagen: "/imagen13.jpg" },
  { titulo: "Estrategias de Branding Empresarial", descripcion: "Descubre cómo posicionar tu marca en el mercado. Aprende sobre identidad visual, storytelling y marketing emocional.", tareasTotales: 6, tareasCompletadas: 4, imagen: "/imagen14.jpg" },
  { titulo: "Introducción a la Inteligencia Artificial", descripcion: "Comprende los conceptos básicos de la IA y sus aplicaciones en diferentes industrias. Aprende sobre machine learning y automatización.", tareasTotales: 5, tareasCompletadas: 2, imagen: "/imagen15.jpg" },
  { titulo: "Contabilidad y Finanzas para No Financieros", descripcion: "Adquiere conocimientos clave sobre finanzas y contabilidad. Aprende a gestionar presupuestos y tomar decisiones económicas informadas.", tareasTotales: 7, tareasCompletadas: 5, imagen: "/imagen16.jpg" },
  { titulo: "Desarrollo Personal y Motivación", descripcion: "Descubre cómo establecer metas y mantenerte motivado para alcanzarlas. Mejora tu mentalidad y hábitos diarios para el éxito.", tareasTotales: 4, tareasCompletadas: 2, imagen: "/imagen17.jpg" },
];


export default function CursosDashboard() {
  const [indexAsignados, setIndexAsignados] = useState<number>(0);
  const [indexOpcionales, setIndexOpcionales] = useState<number>(0);
  const [indexRecomendados, setIndexRecomendados] = useState<number>(0);
  const router = useRouter();

  const mover = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    lista: Curso[],
    direccion: number
  ) => {
    setter((prev: number) =>
      Math.max(0, Math.min(prev + direccion, Math.ceil(lista.length / 2) - 1))
    );
  };

  const renderizarCursos = (lista: Curso[], indice: number) => {
    return (
      <div className="flex gap-6 mt-4"> 
        {[0, 1].map((i) => {
          const curso = lista[indice * 2 + i];
          if (!curso) return null;
  
          return ( 
            <div key={curso.titulo} className="w-[500px] h-52 border-4 rounded-2xl flex items-center cursor-pointer" style={{ borderColor: '#06D6A0', backgroundColor: "#141414" }} onClick={() => router.push(`/curso/${encodeURIComponent(curso.titulo)}`)}>
              <div className="flex-1 p-3">
                <div style={{color: 'white', fontSize: 20, fontWeight: '500'}}>{curso.titulo}</div>
                <div style={{width: '100%', color: '#999999', fontSize: 12, fontWeight: '300'}}>{curso.descripcion}</div>
                <br /> 
                <div className="flex items-center space-x-2">
                  <div style={{color: '#06D6A0', fontSize: 12}}>
                    {curso.tareasCompletadas} de {curso.tareasTotales}
                  </div>
                  <div style={{color: '#999999', fontSize: 12}}>
                    módulos completados
                  </div>
                </div>
                <div className="flex gap-2 mt-2 w-60">
                  {Array.from({ length: curso.tareasTotales }, (_, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 h-1 rounded-full transition-all ${idx < curso.tareasCompletadas ? "bg-[#06D6A0]" : "bg-gray-500"}`}
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
  };

  return ( 
    <div className="min-h-screen bg-[#333333] text-white p-6 ml-[250px]"> {/* Se quita el 250*/}
      <header className="flex justify-between items-center mb-4">
        <div className="bg-[#141414] p-4 rounded-lg w-full max-w flex items-center justify-between"> {/*Para el negro*/}
          <div className="flex items-center gap-3 bg-[#333333] p-1 rounded-lg flex-grow max-w-4xl">
            <Search className="text-[#8A8A8A] w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent text-white outline-none flex-grow"
            />
          </div>

          {/* Contenedor de iconos alineados a la derecha */}
          <div className="flex items-center gap-4 ml-4">
            <a href="https://www.nintendo.com">
              <Bell className="text-[#8A8A8A] w-6 h-6 cursor-pointer" />
            </a>
            <a href="https://www.nintendo.com">
              <User className="text-[#8A8A8A] w-6 h-6 cursor-pointer" />
            </a>
          </div>
        </div>
      </header>
      

    <div className="flex justify-between items-center">
      <h2 style={{color: 'white', fontSize: 30, fontWeight: '600', wordWrap: 'break-word'}}>Mis Cursos</h2>
      <div className="flex">
    <a
      href="https://www.nintendo.com"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center"
    >
      <div className="bg-teal-600 text-white w-60 h-12 flex flex-col items-left justify-center rounded-l-full pl-4">
        <span className="text-[#333333] text-sm">Sigue aprendiendo</span>
        <span className="text-white text-medium font-bold">Entrar a Global Campus</span>
      </div>
      <div className="bg-white text-gray-900 w-30 h-12 flex flex-col items-left justify-center rounded-r-full pl-2">
        <span className="text-[#333333] font-light text-medium">Global</span>
        <span className="text-[#333333] font-bold text-medium">Campus</span>
      </div>
    </a>
  </div>
</div>


      {[{ titulo: "Mis Cursos Asignados", lista: cursosAsignados, indice: indexAsignados, setIndice: setIndexAsignados },
        { titulo: "Mis Cursos Opcionales", lista: cursosOpcionales, indice: indexOpcionales, setIndice: setIndexOpcionales },
        { titulo: "Mis Cursos Recomendados", lista: cursosRecomendados, indice: indexRecomendados, setIndice: setIndexRecomendados }]
        .map(({ titulo, lista, indice, setIndice }) => (
          <div key={titulo} className="bg-[#141414] p-4 rounded-lg w-full mt-8">
            <h3 className="text-[#999999]" style={{ fontSize: '16px' }}>{titulo}</h3>
            {renderizarCursos(lista, indice)}
            <div className="flex items-center justify-between mt-4">
              <button className="p-2 bg-[#141414] rounded-full" onClick={() => mover(setIndice, lista, -1)}>
                <ChevronLeft />
              </button>
              <div className="flex items-center justify-center mt-4">
                {Array.from({ length: Math.ceil(lista.length / 2) }, (_, i) => (
                  <div key={i} className={`w-3 h-3 rounded-full mx-1 transition-all ${i === indice ? 'bg-[#636364]' : 'bg-[#D9D9D9]'}`}></div>
                ))}
              </div>
              <button className="p-2 bg-[#141414] rounded-full" onClick={() => mover(setIndice, lista, 1)}>
                <ChevronRight />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
