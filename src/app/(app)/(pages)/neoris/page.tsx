"use client";

import {
  Briefcase,
  Globe,
  Users,
  HeartHandshake,
  Target,
  CalendarCheck,
} from "lucide-react";

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

      {/* Línea del Tiempo NEORIS */}
      <div className="pt-10">
        <h2 className="text-[32px] font-bold text-[#448AFF] text-center mb-12">Línea del Tiempo NEORIS</h2>
        <div className="relative border-l-4 border-[#448AFF] ml-6 space-y-12">
          {[
            {
              year: "2000 – Fundación",
              color: "#448AFF",
              text: "Nace NEORIS como iniciativa de CEMEX, integrando varias empresas de tecnología en Latinoamérica y Europa."
            },
            {
              year: "2010 – Expansión Global",
              color: "#06D6A0",
              text: "Consolida presencia en Estados Unidos, Europa y América Latina, desarrollando más de 1,000 proyectos de transformación digital."
            },
            {
              year: "2022 – Alianza Estratégica",
              color: "#F57C00",
              text: "Advent International adquiere el 65% de la compañía para potenciar su crecimiento global. CEMEX mantiene el 35%."
            },
            {
              year: "2023 – Expansión en EE.UU.",
              color: "#FFD166",
              text: "Adquisición de ForeFront, importante socio de Salesforce, para fortalecer su presencia en el mercado estadounidense."
            }
          ].map((event, index) => (
            <div key={index} className="relative">
              <div className="absolute -left-[42px] top-1 w-5 h-5 rounded-full border-4" style={{ backgroundColor: event.color, borderColor: '#042C45' }} />
              <div className="ml-4">
                <h4 className="text-white text-[18px] font-bold mb-1">{event.year}</h4>
                <p className="text-gray-400 text-sm">{event.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
