import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TimeCard from "../app/(authed)/timecard/page";

describe('TimeCard Component', () => {

  test('al presionar "ver más" se muestra la lista de cursos del día', async () => {
    render(<TimeCard />);
    const verMasCheckboxes = await screen.findAllByRole('checkbox');
    fireEvent.click(verMasCheckboxes[0]);

    expect(await screen.findByText(/No hay cursos hechos este día/i)).toBeInTheDocument();
  });

  test('añadir curso muestra inputs para título y horas', async () => {
    render(<TimeCard />);
    const verMasCheckboxes  = await screen.findAllByRole('checkbox');
    fireEvent.click(verMasCheckboxes[0]);

    const addButton = await screen.findByText('+ Añadir Curso');
    fireEvent.click(addButton);

    expect(await screen.findByPlaceholderText('Nombre de Curso')).toBeInTheDocument();
    expect(await screen.findByRole('spinbutton')).toBeInTheDocument(); // input number
  });

  test('añadir y guardar curso muestra curso guardado en pantalla', async () => {
    render(<TimeCard />);
    const checkboxes = await screen.findAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
  
    fireEvent.click(await screen.findByText('+ Añadir Curso'));
  
    const titleInput = await screen.findByPlaceholderText('Nombre de Curso');
    const hoursInput = await screen.findByRole('spinbutton');
  
    fireEvent.change(titleInput, { target: { value: 'Curso de Python' } });
    fireEvent.change(hoursInput, { target: { value: '4' } });
  
    fireEvent.click(await screen.findByText('Aceptar'));
    fireEvent.click(await screen.findByText('Guardar'));
  
    // Ahora verificar que el curso se muestra en pantalla
    expect(await screen.findByText((text) => text.includes('Curso de Python'))).toBeInTheDocument();
    expect(await screen.findByText((text) => text.includes('4 horas'))).toBeInTheDocument();
  });

  test('impide cambiar semana si hay edición activa', async () => {
    render(<TimeCard />);
    const checkboxes = await screen.findAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
  
    fireEvent.click(await screen.findByText('+ Añadir Curso'));
    fireEvent.click(await screen.findByText('‹ Periodo Anterior'));
  
    const warning = await screen.findByText((content) =>
      content.includes('Tienes cambios sin guardar') ||
      content.includes('No puedes cambiar de semana')
    );
  
    expect(warning).toBeInTheDocument();
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
