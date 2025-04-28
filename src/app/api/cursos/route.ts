type Curso = {
    nombre: string;
    estado: string;
    abierto: string;
};

export async function GET() {
    const cursos: Curso[] = [
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

    return new Response(JSON.stringify(cursos), {
        headers: { 'Content-Type': 'application/json' },
    });
}
