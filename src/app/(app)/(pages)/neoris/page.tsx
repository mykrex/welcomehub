"use client";

import { Briefcase, Globe, Users, HeartHandshake, Target } from "lucide-react";

export default function AboutNeoris() {
  return (
    <div className="p-6 bg-[#042C45] rounded-lg space-y-6">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center space-y-4">
        <h1 className="text-[40px] font-bold text-[#448AFF]">
          ¿Quiénes Somos en NEORIS?
        </h1>
        <p className="text-gray-400 text-lg">
          Somos una aceleradora digital global que ayuda a las empresas a reinventarse 
          mediante soluciones tecnológicas innovadoras. Combinamos experiencia en la industria 
          con pensamiento disruptivo para generar impacto real.
        </p>
      </div>

      {/* Main Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center bg-[#333] p-6 rounded-lg space-y-4 border-b-4 border-[#448AFF]">
          <Globe className="w-16 h-16 text-[#448AFF]" />
          <h3 className="text-white text-[20px] font-bold">Presencia Global</h3>
          <p className="text-gray-400 text-center">
            Estamos presentes en más de 10 países, conectando talento multicultural para impulsar el cambio digital.
          </p>
        </div>

        <div className="flex flex-col items-center bg-[#333] p-6 rounded-lg space-y-4 border-b-4 border-[#06D6A0]">
          <Users className="w-16 h-16 text-[#06D6A0]" />
          <h3 className="text-white text-[20px] font-bold">Equipo Experto</h3>
          <p className="text-gray-400 text-center">
            Nuestro equipo combina experiencia tecnológica con un enfoque humano para construir soluciones personalizadas.
          </p>
        </div>

        <div className="flex flex-col items-center bg-[#333] p-6 rounded-lg space-y-4 border-b-4 border-[#F57C00]">
          <Briefcase className="w-16 h-16 text-[#F57C00]" />
          <h3 className="text-white text-[20px] font-bold">Innovación Constante</h3>
          <p className="text-gray-400 text-center">
            Apostamos por la innovación continua como motor para transformar industrias y crear valor sostenible.
          </p>
        </div>
      </div>

      {/* Valores NEORIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="flex flex-col items-center bg-[#1C3A4E] p-6 rounded-lg space-y-4 border-l-4 border-[#FFD166]">
          <Target className="w-12 h-12 text-[#FFD166]" />
          <h3 className="text-white text-[20px] font-bold">Nuestro Propósito</h3>
          <p className="text-gray-400 text-center">
            Empoderar a nuestros clientes para alcanzar sus objetivos a través de la tecnología, la creatividad y el conocimiento profundo de la industria.
          </p>
        </div>
        <div className="flex flex-col items-center bg-[#1C3A4E] p-6 rounded-lg space-y-4 border-l-4 border-[#EF476F]">
          <HeartHandshake className="w-12 h-12 text-[#EF476F]" />
          <h3 className="text-white text-[20px] font-bold">Nuestros Valores</h3>
          <p className="text-gray-400 text-center">
            Nos guiamos por la integridad, el compromiso, la colaboración y la pasión por entregar resultados excepcionales.
          </p>
        </div>
      </div>
    </div>
  );
}
