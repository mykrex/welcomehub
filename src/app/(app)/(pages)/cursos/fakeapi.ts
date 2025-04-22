export interface Courses {
    title: string;
    description: string;
    totalCourses: number;
    completedCourses: number;
    picture: string;
  }
  
  export function getCursos(): Promise<{
    asignedCourses: Courses[];
    optionalCourses: Courses[];
    recomendedCourses: Courses[];
  }> 
  {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          asignedCourses: [
            {
              title: "Estrategias de Venta Avanzadas",
              description:
                "Domina técnicas de persuasión y negociación para cerrar más ventas. Aprende a identificar necesidades y ofrecer soluciones efectivas.",
              totalCourses: 6,
              completedCourses: 3,
              picture: "/imagen1.jpg",
            },
            {
              title: "Gestión del Tiempo y Productividad",
              description:
                "Aprende a organizar tus tareas diarias de manera eficiente. Reduce el estrés y aumenta tu rendimiento con estrategias probadas.",
              totalCourses: 5,
              completedCourses: 2,
              picture: "/imagen2.jpg",
            },
            {
              title: "Liderazgo en la Nueva Era",
              description:
                "Desarrolla habilidades para liderar equipos en entornos cambiantes. Fomenta la innovación y la motivación en tu equipo.",
              totalCourses: 8,
              completedCourses: 4,
              picture: "/imagen3.jpg",
            },
            {
              title: "Trabajo en Equipo y Resolución de Conflictos",
              description:
                "Aprende estrategias para mejorar la comunicación y el desempeño del equipo. Domina técnicas para manejar conflictos de manera efectiva.",
              totalCourses: 6,
              completedCourses: 5,
              picture: "/imagen4.jpg",
            },
          ],
          optionalCourses: [
            {
              title: "Dominando Excel desde Cero",
              description:
                "Aprende desde lo básico hasta funciones avanzadas de Excel. Mejora tu productividad y precisión en el manejo de datos.",
              totalCourses: 5,
              completedCourses: 1,
              picture: "/imagen7.jpg",
            },
            {
              title: "Fundamentos de Programación en Python",
              description:
                "Descubre los principios básicos de programación con Python. Aprende a escribir código eficiente y estructurado.",
              totalCourses: 6,
              completedCourses: 3,
              picture: "/imagen8.jpg",
            },
          ],
          recomendedCourses: [
            {
              title: "Gestión de Proyectos Ágiles",
              description:
                "Aprende metodologías ágiles como Scrum y Kanban para gestionar proyectos de manera eficiente. Optimiza tiempos y mejora la entrega de resultados.",
              totalCourses: 6,
              completedCourses: 2,
              picture: "/imagen10.jpg",
            },
            {
              title: "Ventas y Atención al Cliente",
              description:
                "Domina las mejores prácticas para atender clientes y cerrar ventas. Mejora la experiencia del cliente y fideliza compradores.",
              totalCourses: 5,
              completedCourses: 3,
              picture: "/imagen11.jpg",
            },
          ],
        });
      }, 800); // Simula un delay
    });
  }
  