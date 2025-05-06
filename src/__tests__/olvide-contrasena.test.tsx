import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OlvideContrasena from '@/app/olvide_contrasena/page';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => ({
            data: null,
            error: null
          }),
        }),
      }),
    }),
  },
}));

describe('Formulario OlvideContrasena', () => {
  it('❌ Rechaza correo inválido (no @neoris.mx)', async () => {
    render(<OlvideContrasena />);
    fireEvent.change(screen.getByPlaceholderText(/usuario@neoris\.mx/i), {
      target: { value: 'usuario@gmail.com' },
    });
    fireEvent.click(screen.getByText(/Seguir/i));
    expect(await screen.findByText(/Correo inválido/i)).toBeInTheDocument();
  });

  it('❌ Rechaza si el correo no existe en la BD', async () => {
    render(<OlvideContrasena />);
    fireEvent.change(screen.getByPlaceholderText(/usuario@neoris\.mx/i), {
      target: { value: 'noexiste@neoris.mx' },
    });
    fireEvent.click(screen.getByText(/Seguir/i));
    await waitFor(() =>
      expect(screen.getByText(/Usuario no encontrado/i)).toBeInTheDocument()
    );
  });
});