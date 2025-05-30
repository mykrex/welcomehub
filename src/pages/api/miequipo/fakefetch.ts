// pages/api/miequipo/fakefetch.ts

export interface EmpleadoNuevo {
  id: number;
  name: string;
  photo: string;
  courses: {
    completed: number;
    inProgress: number;
    notStarted: number;
  };
  obligatoryCourses: {
    completed: number;
    inProgress: number;
    notStarted: number;
  };
  projectsPerDay: {
    [isoDate: string]: {
      project: string;
      hours: number;
    }[];
  };
  deliveryDate: string | null;
  approvalDate: string | null;
}

export async function fetchFakeEquipo(): Promise<{ teamName: string; employees: EmpleadoNuevo[] }> {
  return {
    teamName: "Equipo Beta",
    employees: [
      {
        id: 10,
        name: "Ana Ramírez",
        photo: "/placeholder_profile.png",
        courses: {
          completed: 3,
          inProgress: 1,
          notStarted: 2,
        },
        obligatoryCourses: {
          completed: 1,
          inProgress: 1,
          notStarted: 1,
        },
        projectsPerDay: {
          "2025-05-20": [
            { project: "Gamificación", hours: 2 },
            { project: "UX Research", hours: 5 },
          ],
          "2025-05-21": [{ project: "Gamificación", hours: 5 }],
          "2025-05-24": [{ project: "Proyecto C", hours: 4 }],
        },
        deliveryDate: "2025-05-25",
        approvalDate: "2025-05-26",
      },
      {
        id: 11,
        name: "Carlos Díaz",
        photo: "/placeholder_profile.png",
        courses: {
          completed: 1,
          inProgress: 2,
          notStarted: 0,
        },
        obligatoryCourses: {
          completed: 1,
          inProgress: 0,
          notStarted: 0,
        },
        projectsPerDay: {
          "2025-05-20": [
            { project: "Admin Panel", hours: 5 },
            { project: "Dr Mario", hours: 5 },
            { project: "Admin Panel", hours: 1 },
          ],
          "2025-05-22": [{ project: "Gamificación", hours: 2 }],
          "2025-05-26": [
            { project: "Proyecto Z", hours: 3 },
            { project: "Proyecto B", hours: 3 },
            { project: "Dr Mario", hours: 5 },
          ],
        },
        deliveryDate: null,
        approvalDate: null,
      },
    ],
  };
}


/*// pages/api/miequipo/fakefetch.ts

export interface EmpleadoNuevo {
  id: number;
  name: string;
  photo: string;
  courses: {
    completed: number;
    inProgress: number;
    incomplete: number;
    notStarted: number;
  };
  projectsPerDay: {
    [isoDate: string]: {
      project: string;
      hours: number;
    }[];
  };
  deliveryDate: string | null;
  approvalDate: string | null;
}

export async function fetchFakeEquipo(): Promise<{ teamName: string; employees: EmpleadoNuevo[] }> {
  return {
    teamName: "Equipo Beta",
    employees: [
      {
        id: 1,
        name: "Ana Ramírez",
        photo: "/placeholder_profile.png",
        courses: {
          completed: 3,
          inProgress: 1,
          incomplete: 0,
          notStarted: 2,
        },
        projectsPerDay: {
          "2025-05-20": [
            { project: "Gamificación", hours: 2 },
            { project: "UX Research", hours: 5 },
          ],
          "2025-05-21": [{ project: "Gamificación", hours: 5 }],
          "2025-05-24": [{ project: "Proyecto C", hours: 4 }],
        },
        deliveryDate: "2025-05-25",
        approvalDate: "2025-05-26",
      },
      {
        id: 2,
        name: "Carlos Díaz",
        photo: "/placeholder_profile.png",
        courses: {
          completed: 1,
          inProgress: 2,
          incomplete: 1,
          notStarted: 0,
        },
        projectsPerDay: {
          "2025-05-20": [
            { project: "Admin Panel", hours: 5 },
            { project: "Dr Mario", hours: 5 },
            { project: "Admin Panel", hours: 1 },
          ],
          "2025-05-22": [{ project: "Gamificación", hours: 2 }],
          "2025-05-26": [
            { project: "Proyecto Z", hours: 3 },
            { project: "Proyecto B", hours: 3 },
            { project: "Dr Mario", hours: 5 },
          ],
        },
        deliveryDate: null,
        approvalDate: null,
      },
      {
        id: 3,
        name: "Lucía Torres",
        photo: "/placeholder_profile.png",
        courses: {
          completed: 2,
          inProgress: 1,
          incomplete: 1,
          notStarted: 0,
        },
        projectsPerDay: {
          "2025-05-21": [
            { project: "Proyecto UX", hours: 4 },
            { project: "Documentación", hours: 3 },
          ],
          "2025-05-23": [
            { project: "Documentación", hours: 6 },
          ],
        },
        deliveryDate: "2025-05-24",
        approvalDate: null,
      },
    ],
  };
}
*/