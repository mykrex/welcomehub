import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminPanel from '../app/(authed)/miequipo/page'; // Ajusta si tu path es diferente
import * as api from '@/app/api/miequipo/miequipo';
/*Para correr solo este es: 
npx jest src/__tests__/miequipo.test.tsx

Advertencia: En tsconfig.json (hasta abajo del codigo)
se cambia el "jsx": "preserve", a "jsx": "react-jsx" 
El preserve es para el programa y el react-jsx para las pruebas
*/


const mockEmployees = [
  {
    id: 1,
    name: 'Carlos Pérez',
    photo: "/Avatars/avatar5.jpg",
    hoursPerDay: [2, 4, 6, 3, 5, 1, 0],
    courses: {
      completed: 5,
      inProgress: 2,
      incomplete: 1,
      notStarted: 3,
    },
  },
  {
    id: 2,
    name: 'Ana López',
    photo: "/Avatars/avatar2.jpg",
    hoursPerDay: [1, 1, 2, 2, 1, 0, 0],
    courses: {
      completed: 3,
      inProgress: 1,
      incomplete: 0,
      notStarted: 2,
    },
  },
];

// Mockear la función getTeamInfo
jest.spyOn(api, 'getTeamInfo').mockResolvedValue({
  teamName: 'Equipo Alfa',
  employees: mockEmployees,
});

describe('AdminPanel', () => {
  test('muestra el nombre del equipo y la cantidad de empleados', async () => {
    render(<AdminPanel />);
    expect(await screen.findByText(/Mi equipo: Equipo Alfa/i)).toBeInTheDocument();
    expect(await screen.findByText(/Cantidad de empleados: 2/i)).toBeInTheDocument();
  });

  test('muestra las tarjetas de los empleados', async () => {
    render(<AdminPanel />);
    expect(await screen.findByText('Carlos Pérez')).toBeInTheDocument();
    expect(await screen.findByText('Ana López')).toBeInTheDocument();
  });

  test('al hacer clic en un empleado se muestran sus métricas', async () => {
    render(<AdminPanel />);
    const card = await screen.findByText('Carlos Pérez');
    fireEvent.click(card);

    expect(await screen.findByText('Gráfica de horas de la semana')).toBeInTheDocument();
    expect(await screen.findByText(/Horas totales:/i)).toBeInTheDocument();
    expect(await screen.findByText(/Cursos:/i)).toBeInTheDocument();
    expect(await screen.findByText(/✅ Terminados: 5/)).toBeInTheDocument();
    expect(await screen.findByText(/⏳ En proceso: 2/)).toBeInTheDocument();
    expect(await screen.findByText(/❌ Incompletos: 1/)).toBeInTheDocument();
    expect(await screen.findByText(/⚠️ Sin empezar: 3/)).toBeInTheDocument();
  });

  test('al hacer clic en otro empleado se cambia la selección', async () => {
    render(<AdminPanel />);
    fireEvent.click(await screen.findByText('Carlos Pérez'));

    expect(await screen.findByText(/✅ Terminados: 5/)).toBeInTheDocument();
    expect(await screen.findByText(/⏳ En proceso: 2/)).toBeInTheDocument();
    expect(await screen.findByText(/❌ Incompletos: 1/)).toBeInTheDocument();
    expect(await screen.findByText(/⚠️ Sin empezar: 3/)).toBeInTheDocument();
    fireEvent.click(await screen.findByText('Ana López'));
    expect(await screen.findByText(/✅ Terminados: 3/)).toBeInTheDocument();
    expect(await screen.findByText(/⏳ En proceso: 1/)).toBeInTheDocument();
    expect(await screen.findByText(/❌ Incompletos: 0/)).toBeInTheDocument();
    expect(await screen.findByText(/⚠️ Sin empezar: 2/)).toBeInTheDocument();
  });

  test('al hacer clic de nuevo en el mismo empleado se oculta el detalle', async () => {
    render(<AdminPanel />);
    const card = await screen.findByText('Carlos Pérez');
    fireEvent.click(card);
    expect(await screen.findByText(/Gráfica de horas/i)).toBeInTheDocument();

    fireEvent.click(card);
    await waitFor(() => {
      expect(screen.queryByText(/Gráfica de horas/i)).not.toBeInTheDocument();
    });
  });
});
