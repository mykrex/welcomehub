// Loading response
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fake Users Data
const usersData = [
  {
    name: "Antonio Garza",
    points: 1097,
    rank: 1,
    image: "/Avatars/avatar1.jpg",
  },
  {
    name: "Roberta Valdes",
    points: 998,
    rank: 2,
    image: "/Avatars/avatar (2).jpg",
  },
  {
    name: "David Juarez",
    points: 903,
    rank: 3,
    image: "/Avatars/avatar (3).jpg",
  },
  {
    name: "Rafael Pereira",
    points: 902,
    rank: 4,
    image: "/Avatars/avatar (3).jpg",
  },
  {
    name: "Gabriel David Cruz Martinez",
    points: 887,
    rank: 5,
    image: "/Avatars/avatarGabriel.jpg",
  },
  {
    name: "Gabrielly Tavares",
    points: 850,
    rank: 6,
    image: "/Avatars/avatar (5).jpg",
  },
  {
    name: "Renan Matos",
    points: 657,
    rank: 7,
    image: "/Avatars/avatar (6).jpg",
  },
  {
    name: "Hugo Souza",
    points: 433,
    rank: 8,
    image: "/Avatars/avatar (7).jpg",
  },
  {
    name: "Jessica Silva",
    points: 201,
    rank: 9,
    image: "/Avatars/avatar (8).jpg",
  },
  {
    name: "Fernando Lima",
    points: 198,
    rank: 10,
    image: "/Avatars/avatar (9).jpg",
  },
];

// GET Function Simulation
export const getUsers = async () => {
  await delay(200); // Loading time
  return usersData;
};
