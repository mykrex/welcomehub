// Loading response
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fake Basic Information
const basicInfo = {
  nombre: "Gabriel David",
  apellido: "Cruz Martinez",
  fechaNacimiento: "09/25/1987",
  puesto: "Analista",
  fechaIngreso: "Marzo 2021",
};

// GET Function Simulation
export const getBasicInfo = async () => {
  await delay(500); // Loading time
  return basicInfo;
};
