// Loading response
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fake Team Data
const teamData = [
    {
        rol: "Administrador",
        nombre: "Maria Regina Rodriguez Martinez",
        correo: "mariarodriguez@neoris.mx"
    },
    {
        rol: "Analista",
        nombre: "Juan Carlos Ramirez Fernandez",
        correo: "juancramirez@neoris.mx"
    },
    {
        rol: "Analista",
        nombre: "Jose Antonio Martinez Herrera",
        correo: "joseamartinez@neoris.mx"
    },
    {
        rol: "Intern",
        nombre: "Ana Sofía Gutierrez Solís",
        correo: "anasgutierrez@neoris.mx"
    }
];

// GET Function Simulation
export const getTeam = async () => {
    await delay(500); // Loading time
    return teamData;
};