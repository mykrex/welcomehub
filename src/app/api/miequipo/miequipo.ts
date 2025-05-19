export interface Employee {
    id: number;
    name: string;
    photo: string;
    hoursPerDay: number[];
    courses: {
      completed: number;
      notStarted: number;
      incomplete: number;
      inProgress: number;
    };
  }
  
  export interface TeamInfo {
    teamName: string;
    employees: Employee[];
  }
  
  const teamInfo: TeamInfo = {
    teamName: "Desarrollo Web",
    employees: [
      {
        id: 1,
        name: "Juan Pérez",
        photo: "/Avatars/avatar5.jpg",
        hoursPerDay: [4, 5, 0, 3, 6, 4, 0],
        courses: {
          completed: 5,
          notStarted: 1,
          incomplete: 0,
          inProgress: 2
        }
      },
      {
        id: 2,
        name: "Laura Gómez",
        photo: "/Avatars/avatar3.jpg",
        hoursPerDay: [2, 2, 2, 2, 2, 0, 0],
        courses: {
          completed: 3,
          notStarted: 0,
          incomplete: 1,
          inProgress: 1
        }
      },
      {
        id: 3,
        name: "Carlos Ruiz",
        photo: "/Avatars/avatar4.jpg",
        hoursPerDay: [5, 5, 5, 5, 5, 5, 0],
        courses: {
          completed: 8,
          notStarted: 2,
          incomplete: 1,
          inProgress: 0
        }
      },
      {
        id: 4,
        name: "Ana Torres",
        photo: "/Avatars/avatar6.jpg",
        hoursPerDay: [6, 7, 8, 9, 10, 11, 12],
        courses: {
          completed: 4,
          notStarted: 1,
          incomplete: 0,
          inProgress: 2
        }
      },
      {
        id: 5,
        name: "Mario Torres",
        photo: "/Avatars/avatar2.jpg",
        hoursPerDay: [1, 2, 3, 4, 5, 6, 12],
        courses: {
          completed: 4,
          notStarted: 1,
          incomplete: 0,
          inProgress: 2
        }
      }
    ]
  };
  
  export const getTeamInfo = (): Promise<TeamInfo> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(teamInfo);
      }, 400);
    });
  };