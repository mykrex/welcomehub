import { render, screen } from '@testing-library/react';
import Dashboard from '@/app/(authed)/dashboard/page';

describe('Dashboard', () => {
  beforeEach(() => {
    render(<Dashboard />);
  });

  test('Muestra el progreso general 78% completado', () => {
    expect(screen.getByText(/78% completado/i)).toBeInTheDocument();
  });

  test('Renderiza la lista de cursos con nombre y estado', () => {
    // Nombres de cursos hardcodeados en el componente
    const cursos = [
      "Atencion al cliente y ventas",
      "Introduccion a excel",
      "Crecimiento corporativo",
      "Tecnicas de trabajo en equipo",
      "Liderazgo y Gestion de Equipos",
      "Marketing Digital",
      "Programacion Basica",
    ];

    cursos.forEach(nombreCurso => {
      expect(screen.getByText(nombreCurso)).toBeInTheDocument();
    });

    // Estados esperados
    const estados = ["En Proceso", "Faltante", "Completado"];
    estados.forEach(estado => {
      expect(screen.getAllByText(estado).length).toBeGreaterThan(0);
    });
  });

  test('Los botones de estado tienen la clase CSS correcta según el estado', () => {
    // El estado "En Proceso" tiene clase bg-yellow-400
    const botonesEnProceso = screen.getAllByText("En Proceso");
    botonesEnProceso.forEach(boton => {
      expect(boton).toHaveClass('bg-yellow-400');
    });

    // El estado "Faltante" tiene clase bg-red-500
    const botonesFaltante = screen.getAllByText("Faltante");
    botonesFaltante.forEach(boton => {
      expect(boton).toHaveClass('bg-red-500');
    });

    // El estado "Completado" tiene clase bg-green-500
    const botonesCompletado = screen.getAllByText("Completado");
    botonesCompletado.forEach(boton => {
      expect(boton).toHaveClass('bg-green-500');
    });
  });

  test('Muestra los títulos "Mi Tiempo Promedio" y "Mi Puntaje Promedio"', () => {
    expect(screen.getByText(/Mi Tiempo Promedio/i)).toBeInTheDocument();
    expect(screen.getByText(/Mi Puntaje Promedio/i)).toBeInTheDocument();
  });
});
