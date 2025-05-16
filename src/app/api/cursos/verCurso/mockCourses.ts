import { SeeCourse } from "@/app/api/cursos/verCurso/verCurso";

export const mockCourses: SeeCourse[] = [
  {
    //---------------------------------------------------------------//
    id: 8,
    title: "Fundamentos de la Atención al Cliente",
    instructor: "David Hernandez Sanchez",
    duration: "3 horas",
    description:
      "Este curso proporciona las habilidades esenciales para interactuar de manera efectiva con los clientes, brindando un servicio de calidad y potenciando las ventas. Incluye técnicas de comunicación, resolución de problemas y estrategias de persuasión para mejorar la experiencia del cliente y alcanzar mejores resultados comerciales.",
    image: "/images/fundamentos-atencion.jpg",

    learningPoints: [
      { text: "Desarrollar habilidades de comunicación efectiva" },
      { text: "Aplicar técnicas de ventas estratégicas" },
      { text: "Manejar objeciones y resolver problemas con clientes" },
      { text: "Comprender la psicología del consumidor" },
    ],

    modules: [
      {
        id: 1,
        title: "Introducción al Cliente",
        description:
          "Comprende quién es el cliente y cómo se forma su experiencia.",
        totalSubsections: 3,
        completedSubsections: 3,
        subsections: [
          { id: 1, text: "¿Qué es un cliente?", status: "completed" },
          { id: 2, text: "Tipos de clientes", status: "completed" },
          { id: 3, text: "Expectativas del cliente", status: "completed" },
        ],
      },
      {
        id: 2,
        title: "Comunicación Efectiva",
        description:
          "Técnicas para mejorar la comunicación verbal y no verbal.",
        totalSubsections: 4,
        completedSubsections: 2,
        subsections: [
          { id: 1, text: "Escucha activa", status: "completed" },
          { id: 2, text: "Lenguaje corporal", status: "completed" },
          { id: 3, text: "Barreras de comunicación", status: "incomplete" },
          { id: 4, text: "Uso del tono y voz", status: "incomplete" },
        ],
      },
      {
        id: 3,
        title: "Manejo de Objeciones",
        description:
          "Aprende a enfrentar y superar las objeciones de los clientes.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          { id: 1, text: "Tipos de objeciones", status: "incomplete" },
          { id: 2, text: "Técnicas de resolución", status: "incomplete" },
        ],
      },
    ],
  },
  {
    id: 1,
    title: "Estrategias de Venta Avanzadas",
    instructor: "Carla Domínguez Ramírez",
    duration: "4 horas",
    description:
      "Domina técnicas de persuasión y negociación para cerrar más ventas. Aprende a identificar necesidades y ofrecer soluciones efectivas. Este curso está diseñado para profesionales de ventas que buscan elevar sus resultados a través de herramientas psicológicas, metodologías comprobadas y simulaciones prácticas.",
    image: "/imagen1.jpg",

    learningPoints: [
      {
        text: "Aplicar técnicas de cierre basadas en psicología del consumidor",
      },
      {
        text: "Detectar necesidades ocultas del cliente mediante preguntas clave",
      },
      { text: "Manejar objeciones y transformar dudas en oportunidades" },
      { text: "Utilizar el storytelling como herramienta de venta" },
    ],

    modules: [
      {
        id: 1,
        title: "Fundamentos de la Persuasión",
        description:
          "Comprende las bases de la persuasión y su aplicación en ventas.",
        totalSubsections: 3,
        completedSubsections: 2,
        subsections: [
          { id: 1, text: "Los principios de Cialdini", status: "completed" },
          {
            id: 2,
            text: "Credibilidad y confianza en la venta",
            status: "completed",
          },
          { id: 3, text: "Ética de la persuasión", status: "incomplete" },
        ],
      },
      {
        id: 2,
        title: "Análisis de Necesidades",
        description: "Aprende a identificar qué busca realmente tu cliente.",
        totalSubsections: 3,
        completedSubsections: 1,
        subsections: [
          {
            id: 1,
            text: "Preguntas abiertas vs. cerradas",
            status: "completed",
          },
          { id: 2, text: "Técnica SPIN Selling", status: "incomplete" },
          { id: 3, text: "Escucha estratégica", status: "incomplete" },
        ],
      },
      {
        id: 3,
        title: "Cierre de Ventas",
        description:
          "Explora técnicas efectivas para cerrar tratos con confianza.",
        totalSubsections: 2,
        completedSubsections: 1,
        subsections: [
          {
            id: 1,
            text: "Técnica del cierre alternativo",
            status: "completed",
          },
          {
            id: 2,
            text: "Cierre por resumen de beneficios",
            status: "incomplete",
          },
        ],
      },
      {
        id: 4,
        title: "Manejo de Objeciones",
        description: "Transforma dudas en oportunidades de venta.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          { id: 1, text: "Clasificación de objeciones", status: "incomplete" },
          { id: 2, text: "Técnicas para neutralizarlas", status: "incomplete" },
        ],
      },
      {
        id: 5,
        title: "Ventas Consultivas",
        description: "Construye relaciones de largo plazo con tus clientes.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          { id: 1, text: "Modelo AIDA aplicado al B2B", status: "incomplete" },
          {
            id: 2,
            text: "Generar valor desde el primer contacto",
            status: "incomplete",
          },
        ],
      },
      {
        id: 6,
        title: "Storytelling en Ventas",
        description: "Captura la atención con historias que venden.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          {
            id: 1,
            text: "Elementos de una buena historia",
            status: "incomplete",
          },
          {
            id: 2,
            text: "Usar casos reales como narrativa de impacto",
            status: "incomplete",
          },
        ],
      },
    ],
  },
];
