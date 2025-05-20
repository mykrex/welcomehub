{/* 

import { render, screen, within } from "@testing-library/react";
import Retos from "@/app/(authed)/retos/page";
import "@testing-library/jest-dom";

// Mock de next/image para evitar errores durante pruebas
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} alt={props.alt || "mocked image"} />;
  },
}));

describe("Página de Retos", () => {
  beforeEach(() => {
    render(<Retos />);
  });

  test("muestra las estadísticas del usuario", () => {
    expect(screen.getByText(/Mis Estadísticas/i)).toBeInTheDocument();
    expect(screen.getByText(/Puntos Totales/i)).toBeInTheDocument();
    expect(screen.getByText(/Podios/i)).toBeInTheDocument();

    const statsSection = screen
      .getByText(/Mis Estadísticas/i)
      .closest(".user-stats-container");
    expect(statsSection).toBeInTheDocument();

    if (statsSection instanceof HTMLElement) {
      expect(within(statsSection).getByText(/^Streak$/)).toBeInTheDocument();
      expect(
        within(statsSection).getByText(/Retos Hechos/i)
      ).toBeInTheDocument();
    }
  });

  test("muestra la tabla de retos semanales", () => {
    expect(screen.getByText(/Mis Retos/i)).toBeInTheDocument();
    expect(screen.getByText(/Semana:/i)).toBeInTheDocument();
    expect(screen.getByText(/Estatus/i)).toBeInTheDocument();
    expect(screen.getByText(/Tipo De Reto/i)).toBeInTheDocument();
    expect(screen.getByText(/Descripción/i)).toBeInTheDocument();
    expect(screen.getByText(/Asignado por:/i)).toBeInTheDocument();

    const tablaRetos = screen
      .getByText(/Tipo De Reto/i)
      .closest(".retos-table");
    expect(tablaRetos).toBeInTheDocument();

    if (tablaRetos instanceof HTMLElement) {
      expect(within(tablaRetos).getByText(/^Puntos$/)).toBeInTheDocument();
      expect(within(tablaRetos).getByText(/^Progreso$/)).toBeInTheDocument();
    }
  });

  test("muestra el ranking del equipo", () => {
    expect(screen.getByText(/Ranking de Equipo/i)).toBeInTheDocument();
    expect(screen.getByText(/All Time/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Puntos/i).length).toBeGreaterThan(1);
  });

  test("muestra los logros del usuario si existen", () => {
    expect(screen.getByText(/Logros/i)).toBeInTheDocument();

    const logros = screen.getAllByText(/Ganado:/i);
    expect(logros.length).toBeGreaterThan(0);

    const logroCard = logros[0].closest(".logro-card");
    expect(logroCard).toBeInTheDocument();

    if (logroCard instanceof HTMLElement) {
      expect(within(logroCard).getByText(/de/i)).toBeInTheDocument(); // ejemplo: "19 de Mayo de 2025"
    }
  });
});

*/}
