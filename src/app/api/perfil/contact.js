// Loading response
const delay = (ms) => new Promise(resolve=>setTimeout(resolve, ms));

// Fake Contact Data
const contactData = {
    correo: "gabrieldcruz@neoris.mx",
    telefono: "8172263572",
    password: "1Qwerty$"
};

// GET Function Simulation
export const getContact = async () => {
    await delay(500); //Loading time
    return contactData;
};