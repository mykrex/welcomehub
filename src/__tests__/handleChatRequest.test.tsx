import 'openai/shims/node';
import { handleChatRequest } from "@/utils/handleChatRequest";
import { supabase } from "@/lib/supabase.server";

jest.mock("@/lib/supabase.server");
jest.mock("openai");

describe("handleChatRequest - saludo inicial", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("devuelve un saludo con el nombre del usuario", async () => {
    // Mock Supabase respuestas
    (supabase.from as jest.Mock).mockImplementation((table: string) => {
      switch (table) {
        case "usuario":
          return {
            select: () => ({
              eq: () => ({
                single: () =>
                  Promise.resolve({
                    data: { nombres: "Carlos", puesto: "Developer", id_equipo: 1 },
                    error: null,
                  }),
              }),
            }),
          };
        case "equipo_trabajo":
          return {
            select: () => ({
              eq: () => ({
                single: () =>
                  Promise.resolve({
                    data: { nombre: "Equipo Alpha" },
                    error: null,
                  }),
              }),
            }),
          };
        case "curso_usuario":
          return {
            select: () => ({
              eq: () => ({
                neq: () =>
                  Promise.resolve({
                    data: [],
                    error: null,
                  }),
              }),
            }),
          };
        case "curso":
          return {
            select: () => ({
              ilike: () => ({
                not: () =>
                  Promise.resolve({
                    data: [
                      { id_curso: 1, nombre: "Curso 1", descripcion: "Intro" },
                    ],
                    error: null,
                  }),
              }),
            }),
          };
        case "mensajes":
          return {
            select: () => ({
              eq: () => ({
                order: () => ({
                  limit: () =>
                    Promise.resolve({
                      data: [],
                      error: null,
                    }),
                }),
              }),
            }),
            insert: () => Promise.resolve({ error: null }),
          };
        default:
          return {};
      }
    });

    // Fake request input
    const reqBody = {
      prompt: "",
      id_usuario: 123,
    };

    const response = await handleChatRequest(reqBody);

    expect(response).toBeDefined();
    expect(response.response).toMatch(/Hola Carlos/i);
    expect(response.response).toMatch(/¿en qué puedo ayudarte/i);
  });
});
