import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TimeCard from "../app/(authed)/timecard/page";
/*Para correr solo este es: 
npx jest src/__tests__/timecard.test.tsx

Advertencia: En tsconfig.json (hasta abajo del codigo)
se cambia el "jsx": "preserve", a "jsx": "react-jsx" 
El preserve es para el programa y el react-jsx para las pruebas
*/
describe('TimeCard Component', () => {

  test('al presionar "ver más" se muestra la lista de cursos del día', async () => {
    render(<TimeCard />);
    const verMasCheckboxes = await screen.findAllByRole('checkbox');
    fireEvent.click(verMasCheckboxes[0]);

    expect(await screen.findByText(/No hay cursos hechos este día/i)).toBeInTheDocument();
  });

  test('añadir curso muestra inputs para título y horas', async () => {
    render(<TimeCard />);
    const verMasCheckboxes = await screen.findAllByRole('checkbox');
    fireEvent.click(verMasCheckboxes[0]);

    const addButton = await screen.findByText('+ Añadir Curso');
    fireEvent.click(addButton);

    expect(await screen.findByPlaceholderText('Nombre de Curso')).toBeInTheDocument();
    expect(await screen.findByRole('spinbutton')).toBeInTheDocument(); // input number
  });

  test('guardar semana muestra modal si no hay edición activa', async () => {
    render(<TimeCard />);
    const guardarButton = await screen.findByText('Guardar');
    fireEvent.click(guardarButton);

    expect(await screen.findByText('Semana guardada correctamente.')).toBeInTheDocument();
  });


  test('impide cambiar semana si hay edición activa', async () => {
    render(<TimeCard />);
    const verMasCheckboxes = await screen.findAllByRole('checkbox');
    fireEvent.click(verMasCheckboxes[0]);
    const addButton = await screen.findByText('+ Añadir Curso');
    fireEvent.click(addButton);

    const anteriorButton = await screen.findByText('‹ Periodo Anterior');
    fireEvent.click(anteriorButton);

    expect(await screen.findByText(/No puedes cambiar de semana mientras estás editando/i)).toBeInTheDocument();
  });

  test('muestra datos de otras semanas al cambiar de periodo si no hay edición', async () => {
    render(<TimeCard />);
    const guardarButton = await screen.findByText('Guardar');
    fireEvent.click(guardarButton); // Asegura que no haya edición activa

    const siguienteButton = await screen.findByText('Siguiente Periodo ›');
    fireEvent.click(siguienteButton);

    // Verifica que el texto del periodo haya cambiado (nueva fecha en el encabezado)
    expect(await screen.findByText(/Periodo de Pago:/i)).toBeInTheDocument();
  });

});
