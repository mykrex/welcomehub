import { useEffect, useState } from "react";
import "@/app/verCursos/verCursos.css";

type Curso = {
  nombre: string;
  estado: string;
  abierto: string;
};

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
  const [cursos, setCursos] = useState<Curso[]>([]);

  useEffect(() => {
    const fetchCursos = async () => {
      const res = await fetch("/api/cursos");
      const data = await res.json();
      setCursos(data);
    };

    fetchCursos();
  }, []);

  return (
    <div className="main-content">
      <div>
        {cursos.map((curso, index) => (
          <div
            key={index}
            className={`curso-item ${getColor(curso.estado)}`}
          >
            <h3>{curso.nombre}</h3>
            <p>{curso.estado}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
