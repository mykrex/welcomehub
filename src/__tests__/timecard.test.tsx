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

  test('añadir curso y confirmar lo muestra correctamente', async () => {
    render(<TimeCard />);
    
    const verMasCheckboxes = await screen.findAllByRole('checkbox');
    fireEvent.click(verMasCheckboxes[0]);
  
    const addButton = await screen.findByText('+ Añadir Curso');
    fireEvent.click(addButton);
  
    // Llenar los inputs
    const inputTitulo = await screen.findByPlaceholderText('Nombre de Curso') as HTMLInputElement;
    const inputHoras = await screen.findByRole('spinbutton') as HTMLInputElement;
  
    fireEvent.change(inputTitulo, { target: { value: 'Curso de Python' } });
    fireEvent.change(inputHoras, { target: { value: '4' } });
  
    const aceptarBtn = await screen.findByText('Aceptar'); // Asegúrate de que este botón exista
    fireEvent.click(aceptarBtn);
  
    expect(await screen.findByText('Curso de Python')).toBeInTheDocument();
    expect(await screen.findByText(/4 horas/i)).toBeInTheDocument(); 
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
  
    // Captura el texto actual del periodo, incluyendo las fechas
    const periodoTextoAntes = await screen.findByText(/Periodo de Pago:/i);
    const textoAntes = periodoTextoAntes.textContent;
  
    // Cambiar al siguiente periodo
    const siguienteButton = await screen.findByText('Siguiente Periodo ›');
    fireEvent.click(siguienteButton);
  
    // Captura el texto después del cambio
    const periodoTextoDespues = await screen.findByText(/Periodo de Pago:/i);
    const textoDespues = periodoTextoDespues.textContent;
  
    // Verifica que el texto (con fechas) haya cambiado
    expect(textoDespues).not.toBe(textoAntes);
  });



  test('ver más muestra un texto incorrecto intencionalmente', async () => {
    render(<TimeCard />);
    const verMasCheckboxes = await screen.findAllByRole('checkbox');
    fireEvent.click(verMasCheckboxes[0]);
  
    // Texto incorrecto esperado: no coincide con el real
    expect(await screen.findByText('Cursos del día:')).toBeInTheDocument();
  });


  test('añadir curso con valores incorrectos y validar texto erróneo', async () => {
    render(<TimeCard />);
    const verMasCheckboxes = await screen.findAllByRole('checkbox');
    fireEvent.click(verMasCheckboxes[0]);
  
    const addButton = await screen.findByText('+ Añadir Curso');
    fireEvent.click(addButton);
  
    const inputTitulo = await screen.findByPlaceholderText('Nombre de Curso') as HTMLInputElement;
    const inputHoras = await screen.findByRole('spinbutton') as HTMLInputElement;
  
    fireEvent.change(inputTitulo, { target: { value: 'Matemáticas' } });
    fireEvent.change(inputHoras, { target: { value: '8' } });
  
    const aceptarBtn = await screen.findByText('Aceptar');
    fireEvent.click(aceptarBtn);
  
    // Texto deliberadamente incorrecto para provocar FAIL
    expect(await screen.findByText('Curso de Python')).toBeInTheDocument();
    expect(await screen.findByText(/4 horas/i)).toBeInTheDocument(); 
  });

  test('guardar sin edición no muestra mensaje esperado', async () => {
    render(<TimeCard />);
    const guardarButton = await screen.findByText('Guardar');
    fireEvent.click(guardarButton);
  
    // Espera texto que no existe
    expect(await screen.findByText('Guardado exitosamente')).toBeInTheDocument();
  });

  test('bloqueo de cambio de semana sin edición activa (esperando error)', async () => {
    render(<TimeCard />);
    const anteriorButton = await screen.findByText('‹ Periodo Anterior');
    fireEvent.click(anteriorButton);
  
    // Espera que se bloquee el cambio aunque no hay edición activa (esto está mal)
    expect(await screen.findByText(/No puedes cambiar de semana mientras estás editando/i)).toBeInTheDocument();
  });

  test('fechas no cambian al ir al siguiente periodo (esperado que falle)', async () => {
    render(<TimeCard />);
    const guardarButton = await screen.findByText('Guardar');
    fireEvent.click(guardarButton);
  
    const periodoElemento = await screen.findByText(/Periodo de Pago:/i);
    const textoAntes = periodoElemento.textContent;
  
    const siguienteButton = await screen.findByText('Siguiente Periodo ›');
    fireEvent.click(siguienteButton);
  
    // Intencionalmente espera que el texto NO cambie (lo cual es falso, por eso fallará)
    expect(await screen.findByText(textoAntes!)).toBeInTheDocument();
  });
});
