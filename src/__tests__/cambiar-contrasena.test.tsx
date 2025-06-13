import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CambiarContrasena from '@/app/(login)/cambiar_contrasena/page';

// Mock for this test
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock for the component ProgresoRecuperacion in case of truble
jest.mock('@/app/components/progresoRecuperacion', () => {
  return function MockProgresoRecuperacion({ pasoActual }: { pasoActual: number }) {
    return <div data-testid="progreso-recuperacion">Paso: {pasoActual}</div>;
  };
});

// fetch Mock
global.fetch = jest.fn();

describe('CambiarContrasena', () => {
  beforeEach(() => {
    localStorage.setItem('recup_email', 'test@example.com');
    mockPush.mockClear();
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('debe renderizar el formulario', () => {
    render(<CambiarContrasena />);
    expect(screen.getByText('Establece Nueva Contraseña')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nueva contraseña')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirmar contraseña')).toBeInTheDocument();
  });

  it('debe mostrar error cuando las contraseñas no coinciden', async () => {
    render(<CambiarContrasena />);
    
    fireEvent.change(screen.getByPlaceholderText('Nueva contraseña'), {
      target: { value: 'password1' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirmar contraseña'), {
      target: { value: 'password2' },
    });
    
    fireEvent.click(screen.getByText('Siguiente'));
    
    expect(await screen.findByText('Las contraseñas no coinciden.')).toBeInTheDocument();
  });

  it('debe manejar el envío exitoso', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(<CambiarContrasena />);
    
    fireEvent.change(screen.getByPlaceholderText('Nueva contraseña'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirmar contraseña'), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByText('Siguiente'));
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/restablecimiento_exitoso');
    });
  });
});