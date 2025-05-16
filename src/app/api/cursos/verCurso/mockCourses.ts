import { SeeCourse } from "@/app/api/cursos/verCurso/verCurso";
//1. Estrategias de Venta Avanzadas
//2. Gestión del Tiempo y Productividad
//8. Fundamentos de la atencion al cliente

export const mockCourses: SeeCourse[] = [
  //1
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
  //2
  {
    id: 2,
    title: "Gestión del Tiempo y Productividad",
    instructor: "Mario Castellanos Gutiérrez",
    duration: "3.5 horas",
    description:
      "Aprende a organizar tus tareas diarias de manera eficiente. Reduce el estrés y aumenta tu rendimiento con estrategias probadas como la Matriz de Eisenhower, técnicas Pomodoro y planificación semanal. Ideal para profesionales que buscan alcanzar sus metas sin sacrificar su bienestar.",
    image: "/imagen2.jpg",

    learningPoints: [
      { text: "Priorizar tareas según su urgencia e importancia" },
      { text: "Optimizar bloques de trabajo usando la técnica Pomodoro" },
      { text: "Reducir distracciones digitales y mejorar el enfoque" },
      { text: "Diseñar rutinas diarias sostenibles y equilibradas" },
    ],

    modules: [
      {
        id: 1,
        title: "Fundamentos de la Productividad",
        description:
          "Explora los principios básicos de la gestión del tiempo y por qué la productividad no siempre significa hacer más.",
        totalSubsections: 2,
        completedSubsections: 1,
        subsections: [
          {
            id: 1,
            text: "Diferencia entre ocupación y productividad",
            status: "completed",
          },
          {
            id: 2,
            text: "Factores comunes que afectan tu tiempo",
            status: "incomplete",
          },
        ],
      },
      {
        id: 2,
        title: "Técnicas de Priorización",
        description:
          "Aprende a distinguir tareas importantes de las urgentes para tomar decisiones más efectivas.",
        totalSubsections: 3,
        completedSubsections: 2,
        subsections: [
          {
            id: 1,
            text: "Uso de la Matriz de Eisenhower",
            status: "completed",
          },
          {
            id: 2,
            text: "Regla 80/20 en la gestión de tareas",
            status: "completed",
          },
          {
            id: 3,
            text: "Evitar la trampa de la multitarea",
            status: "incomplete",
          },
        ],
      },
      {
        id: 3,
        title: "Gestión del Tiempo Personal",
        description:
          "Técnicas prácticas para planificar tu día y semana de forma realista.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          {
            id: 1,
            text: "Cómo construir una rutina matutina efectiva",
            status: "incomplete",
          },
          {
            id: 2,
            text: "Planificación semanal con objetivos SMART",
            status: "incomplete",
          },
        ],
      },
      {
        id: 4,
        title: "Enfocar y Proteger tu Atención",
        description:
          "Minimiza interrupciones y mejora tu enfoque con hábitos y herramientas.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          {
            id: 1,
            text: "Gestión de distracciones digitales",
            status: "incomplete",
          },
          {
            id: 2,
            text: "Ambientes de trabajo que favorecen la concentración",
            status: "incomplete",
          },
        ],
      },
      {
        id: 5,
        title: "Productividad Sostenible",
        description:
          "Aprende a mantenerte productivo sin sacrificar tu bienestar físico y mental.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          {
            id: 1,
            text: "Importancia de las pausas y descansos conscientes",
            status: "incomplete",
          },
          {
            id: 2,
            text: "Evitar el burnout mediante límites claros",
            status: "incomplete",
          },
        ],
      },
    ],
  },
  //3
  {
    id: 3,
    title: "Liderazgo en la Nueva Era",
    instructor: "Valeria Estrada Jiménez",
    duration: "5 horas",
    description:
      "Desarrolla habilidades para liderar equipos en entornos cambiantes, diversos y digitales. Este curso te prepara para ser un líder resiliente, empático e innovador, capaz de inspirar y coordinar con claridad en tiempos de incertidumbre.",
    image: "/imagen3.jpg",

    learningPoints: [
      { text: "Distinguir entre liderazgo tradicional y liderazgo adaptativo" },
      { text: "Motivar a equipos multigeneracionales y multiculturales" },
      {
        text: "Gestionar el cambio con inteligencia emocional y comunicación efectiva",
      },
      {
        text: "Desarrollar visión estratégica y habilidades de toma de decisiones",
      },
    ],

    modules: [
      {
        id: 1,
        title: "Introducción al Liderazgo Moderno",
        description:
          "Explora cómo ha evolucionado el concepto de liderazgo en el siglo XXI.",
        totalSubsections: 2,
        completedSubsections: 1,
        subsections: [
          {
            id: 1,
            text: "Del jefe al líder: un cambio de paradigma",
            status: "completed",
          },
          {
            id: 2,
            text: "Liderazgo en contextos híbridos y remotos",
            status: "incomplete",
          },
        ],
      },
      {
        id: 2,
        title: "Estilos de Liderazgo",
        description:
          "Identifica tu estilo de liderazgo y cuándo usar enfoques diferentes.",
        totalSubsections: 2,
        completedSubsections: 1,
        subsections: [
          {
            id: 1,
            text: "Liderazgo transformacional vs. transaccional",
            status: "completed",
          },
          {
            id: 2,
            text: "Liderazgo situacional y adaptable",
            status: "incomplete",
          },
        ],
      },
      {
        id: 3,
        title: "Comunicación y Feedback",
        description:
          "Domina la comunicación clara, directa y empática con tu equipo.",
        totalSubsections: 3,
        completedSubsections: 1,
        subsections: [
          {
            id: 1,
            text: "Escucha activa y liderazgo conversacional",
            status: "completed",
          },
          {
            id: 2,
            text: "Dar y recibir feedback constructivo",
            status: "incomplete",
          },
          {
            id: 3,
            text: "Resolución de conflictos con asertividad",
            status: "incomplete",
          },
        ],
      },
      {
        id: 4,
        title: "Motivación y Cultura de Equipo",
        description:
          "Aprende a crear ambientes motivadores y alineados con los valores de tu organización.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          {
            id: 1,
            text: "Reconocimiento y empoderamiento",
            status: "incomplete",
          },
          {
            id: 2,
            text: "Construcción de confianza en equipos diversos",
            status: "incomplete",
          },
        ],
      },
      {
        id: 5,
        title: "Gestión del Cambio",
        description:
          "Prepárate para liderar procesos de transformación en tu organización.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          {
            id: 1,
            text: "Curva de cambio y resistencia emocional",
            status: "incomplete",
          },
          {
            id: 2,
            text: "Técnicas para facilitar la transición",
            status: "incomplete",
          },
        ],
      },
      {
        id: 6,
        title: "Toma de Decisiones Estratégicas",
        description:
          "Desarrolla habilidades para decidir con visión a largo plazo y bajo presión.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          {
            id: 1,
            text: "Toma de decisiones basada en datos",
            status: "incomplete",
          },
          { id: 2, text: "Delegar de manera efectiva", status: "incomplete" },
        ],
      },
      {
        id: 7,
        title: "Liderazgo con Inteligencia Emocional",
        description:
          "Fortalece tu autoconsciencia y empatía como herramientas de liderazgo.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          {
            id: 1,
            text: "Autoconocimiento y regulación emocional",
            status: "incomplete",
          },
          {
            id: 2,
            text: "Reconocer y gestionar emociones del equipo",
            status: "incomplete",
          },
        ],
      },
      {
        id: 8,
        title: "Liderazgo Ético y Sostenible",
        description:
          "Lidera con integridad, propósito y responsabilidad social.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          { id: 1, text: "Toma de decisiones éticas", status: "incomplete" },
          {
            id: 2,
            text: "Sostenibilidad y liderazgo con impacto",
            status: "incomplete",
          },
        ],
      },
    ],
  },
  //4
  {
    id: 4,
    title: "Trabajo en Equipo y Resolución de Conflictos",
    instructor: "Luis Eduardo Salinas",
    duration: "4 horas",
    description:
      "Aprende estrategias para mejorar la comunicación, la colaboración y el rendimiento dentro de un equipo. Domina herramientas prácticas para identificar, prevenir y resolver conflictos laborales de forma constructiva y profesional.",
    image: "/imagen4.jpg",

    learningPoints: [
      {
        text: "Fomentar una cultura de colaboración y responsabilidad compartida",
      },
      {
        text: "Establecer normas de equipo claras y canales de comunicación efectivos",
      },
      {
        text: "Detectar causas comunes de conflictos y abordarlos oportunamente",
      },
      {
        text: "Aplicar técnicas de mediación y resolución pacífica de desacuerdos",
      },
    ],

    modules: [
      {
        id: 1,
        title: "Fundamentos del Trabajo en Equipo",
        description:
          "Explora las bases de un equipo eficaz y los elementos que lo fortalecen.",
        totalSubsections: 2,
        completedSubsections: 2,
        subsections: [
          {
            id: 1,
            text: "Características de los equipos de alto desempeño",
            status: "completed",
          },
          {
            id: 2,
            text: "Roles y responsabilidades dentro del equipo",
            status: "completed",
          },
        ],
      },
      {
        id: 2,
        title: "Comunicación Asertiva en Equipos",
        description:
          "Mejora la calidad de los intercambios y la comprensión mutua.",
        totalSubsections: 2,
        completedSubsections: 1,
        subsections: [
          {
            id: 1,
            text: "Escucha activa y lenguaje positivo",
            status: "completed",
          },
          {
            id: 2,
            text: "Evitar malentendidos y suposiciones dañinas",
            status: "incomplete",
          },
        ],
      },
      {
        id: 3,
        title: "Colaboración y Toma de Decisiones en Grupo",
        description:
          "Aprende a construir consensos y resolver desacuerdos sin fricciones.",
        totalSubsections: 2,
        completedSubsections: 1,
        subsections: [
          {
            id: 1,
            text: "Técnicas para llegar a acuerdos conjuntos",
            status: "completed",
          },
          {
            id: 2,
            text: "Evitar dinámicas de poder o exclusión",
            status: "incomplete",
          },
        ],
      },
      {
        id: 4,
        title: "Conflictos en el Entorno Laboral",
        description:
          "Identifica las causas, tipos y señales tempranas de conflicto.",
        totalSubsections: 2,
        completedSubsections: 1,
        subsections: [
          {
            id: 1,
            text: "Conflictos funcionales vs. disfuncionales",
            status: "completed",
          },
          {
            id: 2,
            text: "Detección y abordaje preventivo",
            status: "incomplete",
          },
        ],
      },
      {
        id: 5,
        title: "Mediación y Resolución de Conflictos",
        description:
          "Desarrolla habilidades prácticas para intervenir y resolver desacuerdos.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          {
            id: 1,
            text: "Técnicas de mediación colaborativa",
            status: "incomplete",
          },
          {
            id: 2,
            text: "Gestión emocional en conversaciones difíciles",
            status: "incomplete",
          },
        ],
      },
      {
        id: 6,
        title: "Fortalecimiento del Clima Laboral",
        description:
          "Establece condiciones que reduzcan tensiones y mejoren la cohesión.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          {
            id: 1,
            text: "Reconocimiento y feedback positivo",
            status: "incomplete",
          },
          {
            id: 2,
            text: "Promoción de espacios seguros para el diálogo",
            status: "incomplete",
          },
        ],
      },
    ],
  },
  //5
  {
    id: 5,
    title: "Dominando Excel desde Cero",
    instructor: "Andrea Ríos Villanueva",
    duration: "4 horas",
    description:
      "Aprende desde lo más básico hasta herramientas intermedias de Excel. Crea hojas de cálculo efectivas, utiliza fórmulas, organiza datos y genera gráficos profesionales. Ideal para principiantes o quienes buscan mejorar su manejo de datos en el entorno laboral.",
    image: "/imagen7.jpg",

    learningPoints: [
      { text: "Conocer la interfaz y estructura de trabajo de Excel" },
      {
        text: "Usar fórmulas y funciones básicas como SUMA, PROMEDIO, y CONTAR.SI",
      },
      { text: "Aplicar formatos condicionales y validaciones de datos" },
      { text: "Crear gráficos para presentar y analizar información" },
    ],

    modules: [
      {
        id: 1,
        title: "Primeros Pasos en Excel",
        description: "Familiarízate con la interfaz y herramientas básicas.",
        totalSubsections: 3,
        completedSubsections: 1,
        subsections: [
          {
            id: 1,
            text: "Explorando la cinta de opciones",
            status: "completed",
          },
          {
            id: 2,
            text: "Tipos de datos y estructura de celdas",
            status: "incomplete",
          },
          { id: 3, text: "Crear y guardar archivos", status: "incomplete" },
        ],
      },
      {
        id: 2,
        title: "Fórmulas y Funciones Básicas",
        description:
          "Comienza a realizar cálculos y automatizar tareas sencillas.",
        totalSubsections: 3,
        completedSubsections: 0,
        subsections: [
          {
            id: 1,
            text: "Escribir fórmulas manualmente",
            status: "incomplete",
          },
          {
            id: 2,
            text: "Funciones SUMA, PROMEDIO, MAX y MIN",
            status: "incomplete",
          },
          {
            id: 3,
            text: "Uso de referencias absolutas y relativas",
            status: "incomplete",
          },
        ],
      },
      {
        id: 3,
        title: "Formato y Validación de Datos",
        description: "Mejora la presentación y el control de la información.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          {
            id: 1,
            text: "Aplicar formatos condicionales",
            status: "incomplete",
          },
          {
            id: 2,
            text: "Validar datos y evitar errores",
            status: "incomplete",
          },
        ],
      },
      {
        id: 4,
        title: "Gestión y Organización de Información",
        description: "Domina herramientas para manejar tablas y ordenar datos.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          { id: 1, text: "Filtrar y ordenar registros", status: "incomplete" },
          {
            id: 2,
            text: "Convertir rangos en tablas dinámicas simples",
            status: "incomplete",
          },
        ],
      },
      {
        id: 5,
        title: "Visualización con Gráficos",
        description: "Crea representaciones visuales claras y profesionales.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          {
            id: 1,
            text: "Insertar gráficos de barras, líneas y circulares",
            status: "incomplete",
          },
          {
            id: 2,
            text: "Personalizar elementos del gráfico",
            status: "incomplete",
          },
        ],
      },
    ],
  },
  //6
  {
    id: 6,
    title: "Fundamentos de Programación en Python",
    instructor: "Daniel Lozano Tamez",
    duration: "4.5 horas",
    description:
      "Descubre los principios básicos de programación utilizando Python, uno de los lenguajes más populares y versátiles en la industria. Aprende a escribir código limpio, resolver problemas comunes y construir programas simples que sienten las bases para tu desarrollo como programador.",
    image: "/imagen8.jpg",

    learningPoints: [
      {
        text: "Comprender la lógica de programación y estructuras secuenciales",
      },
      { text: "Utilizar variables, operadores y estructuras de control" },
      { text: "Definir funciones y reutilizar código de forma modular" },
      { text: "Trabajar con listas, bucles y condicionales" },
    ],

    modules: [
      {
        id: 1,
        title: "Introducción a la Programación y Python",
        description:
          "Entiende los conceptos fundamentales de programación y el entorno Python.",
        totalSubsections: 2,
        completedSubsections: 1,
        subsections: [
          {
            id: 1,
            text: "¿Qué es programar y por qué Python?",
            status: "completed",
          },
          {
            id: 2,
            text: "Instalación y uso de un editor de código",
            status: "incomplete",
          },
        ],
      },
      {
        id: 2,
        title: "Variables y Tipos de Datos",
        description:
          "Aprende a almacenar y manipular información dentro de tu programa.",
        totalSubsections: 3,
        completedSubsections: 2,
        subsections: [
          { id: 1, text: "Declaración de variables", status: "completed" },
          {
            id: 2,
            text: "Tipos de datos comunes en Python",
            status: "completed",
          },
          { id: 3, text: "Conversión entre tipos", status: "incomplete" },
        ],
      },
      {
        id: 3,
        title: "Operadores y Expresiones",
        description: "Realiza operaciones matemáticas y lógicas básicas.",
        totalSubsections: 2,
        completedSubsections: 1,
        subsections: [
          {
            id: 1,
            text: "Operadores aritméticos, lógicos y de comparación",
            status: "completed",
          },
          {
            id: 2,
            text: "Orden de operaciones y paréntesis",
            status: "incomplete",
          },
        ],
      },
      {
        id: 4,
        title: "Condicionales y Bucles",
        description:
          "Controla el flujo de tu programa según condiciones y repeticiones.",
        totalSubsections: 3,
        completedSubsections: 1,
        subsections: [
          { id: 1, text: "Uso de if, elif y else", status: "completed" },
          { id: 2, text: "Bucles for y while", status: "incomplete" },
          { id: 3, text: "Uso de break y continue", status: "incomplete" },
        ],
      },
      {
        id: 5,
        title: "Listas y Colecciones",
        description:
          "Manipula múltiples elementos con estructuras de datos integradas.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          {
            id: 1,
            text: "Listas, tuplas y diccionarios",
            status: "incomplete",
          },
          {
            id: 2,
            text: "Operaciones básicas sobre listas",
            status: "incomplete",
          },
        ],
      },
      {
        id: 6,
        title: "Funciones y Modularidad",
        description:
          "Organiza tu código y evita repeticiones creando funciones reutilizables.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          {
            id: 1,
            text: "Definición y llamado de funciones",
            status: "incomplete",
          },
          {
            id: 2,
            text: "Parámetros, argumentos y retorno de valores",
            status: "incomplete",
          },
        ],
      },
    ],
  },
  //7
  {
    id: 7,
    title: "Gestión de Proyectos Ágiles",
    instructor: "Paola Méndez Rodríguez",
    duration: "4 horas",
    description:
      "Aprende a planificar, ejecutar y entregar proyectos de forma ágil usando metodologías como Scrum y Kanban. Este curso te preparará para liderar equipos dinámicos, adaptarte rápidamente a cambios y mejorar continuamente los procesos de desarrollo y entrega.",
    image: "/imagen10.jpg",

    learningPoints: [
      { text: "Comprender los principios y valores del manifiesto ágil" },
      { text: "Aplicar el marco Scrum para organizar equipos y tareas" },
      { text: "Visualizar y gestionar flujos de trabajo con Kanban" },
      { text: "Mejorar la colaboración, comunicación y velocidad de entrega" },
    ],

    modules: [
      {
        id: 1,
        title: "Introducción a las Metodologías Ágiles",
        description:
          "Conoce la filosofía ágil y los beneficios frente a métodos tradicionales.",
        totalSubsections: 2,
        completedSubsections: 1,
        subsections: [
          {
            id: 1,
            text: "El Manifiesto Ágil y sus valores",
            status: "completed",
          },
          {
            id: 2,
            text: "Comparación entre métodos ágiles y en cascada",
            status: "incomplete",
          },
        ],
      },
      {
        id: 2,
        title: "Scrum: Roles y Artefactos",
        description: "Explora cómo se estructura Scrum y quién hace qué.",
        totalSubsections: 3,
        completedSubsections: 1,
        subsections: [
          {
            id: 1,
            text: "Product Owner, Scrum Master y equipo de desarrollo",
            status: "completed",
          },
          {
            id: 2,
            text: "Backlog del producto y del sprint",
            status: "incomplete",
          },
          {
            id: 3,
            text: "Incremento y definición de hecho",
            status: "incomplete",
          },
        ],
      },
      {
        id: 3,
        title: "Eventos Scrum",
        description:
          "Aprende a organizar el trabajo con reuniones estructuradas y efectivas.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          {
            id: 1,
            text: "Planificación del Sprint y Daily Standup",
            status: "incomplete",
          },
          {
            id: 2,
            text: "Revisión y retrospectiva del Sprint",
            status: "incomplete",
          },
        ],
      },
      {
        id: 4,
        title: "Kanban: Visualización del Flujo de Trabajo",
        description:
          "Aplica tableros Kanban para gestionar tareas y mejorar el ritmo de trabajo.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          { id: 1, text: "Principios del método Kanban", status: "incomplete" },
          {
            id: 2,
            text: "Creación y gestión de un tablero Kanban",
            status: "incomplete",
          },
        ],
      },
      {
        id: 5,
        title: "Métricas y Mejora Continua",
        description:
          "Evalúa y ajusta tu proceso ágil para hacerlo más eficiente.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          {
            id: 1,
            text: "Velocidad del equipo y gráficas de burndown",
            status: "incomplete",
          },
          {
            id: 2,
            text: "Retrospectivas efectivas y acciones de mejora",
            status: "incomplete",
          },
        ],
      },
      {
        id: 6,
        title: "Agilidad en el Mundo Real",
        description: "Casos de uso y adaptación ágil en diferentes industrias.",
        totalSubsections: 2,
        completedSubsections: 0,
        subsections: [
          {
            id: 1,
            text: "Ágil más allá del software: marketing, RRHH y educación",
            status: "incomplete",
          },
          {
            id: 2,
            text: "Errores comunes al implementar agilidad",
            status: "incomplete",
          },
        ],
      },
    ],
  },

  //8
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
];
