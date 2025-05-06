import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CambiarContrasena from '@/app/cambiar_contrasena/page';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({
      update: () => ({
        eq: () => ({
          error: null,
        }),
      }),
    }),
  },
}));

beforeEach(() => {
  localStorage.setItem('correo_recuperacion', 'usuario@neoris.mx');
});

afterEach(() => {
  localStorage.clear();
});

describe('Formulario CambiarContrasena', () => {
  it('❌ Rechaza contraseñas que no coinciden', async () => {
    render(<CambiarContrasena />);
    fireEvent.change(screen.getByPlaceholderText(/Nueva contraseña/i), {
      target: { value: 'Pass123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirmar contraseña/i), {
      target: { value: 'OtraPass456!' },
    });
    fireEvent.click(screen.getByText(/Siguiente/i));
    expect(await screen.findByText(/no coinciden/i)).toBeInTheDocument();
  });

  it('❌ Rechaza contraseña inválida (no cumple patrón)', async () => {
    render(<CambiarContrasena />);
    fireEvent.change(screen.getByPlaceholderText(/Nueva contraseña/i), {
      target: { value: 'abc123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirmar contraseña/i), {
      target: { value: 'abc123' },
    });
    fireEvent.click(screen.getByText(/Siguiente/i));
    expect(
      await screen.findByText(/La contraseña debe tener al menos 8 caracteres/i)
    ).toBeInTheDocument();
  });

  it('✅ Acepta y actualiza contraseña válida', async () => {
    window.alert = jest.fn(); // mock para evitar que se rompa test por alert
    render(<CambiarContrasena />);
    fireEvent.change(screen.getByPlaceholderText(/Nueva contraseña/i), {
      target: { value: 'NuevaPass123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirmar contraseña/i), {
      target: { value: 'NuevaPass123!' },
    });
    fireEvent.click(screen.getByText(/Siguiente/i));
    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        'Contraseña actualizada exitosamente.'
      )
    );
  });
});