// src/__tests__/foto-perfil.test.tsx
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import FotoPerfil from '@/app/components/fotoPerfil';

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:mocked-url');

jest.mock('@/lib/supabase', () => ({
  supabase: {
    storage: {
      from: () => ({
        download: jest.fn().mockResolvedValue({
          data: new Blob(['test image content'], { type: 'image/png' }),
        }),
        upload: jest.fn().mockResolvedValue({ data: {}, error: null }),
        remove: jest.fn().mockResolvedValue({ data: {}, error: null }),
      }),
    },
  },
}));

describe('HU-44: Foto de perfil', () => {
  const userId = '123';

  test('H44T1: Muestra imagen desde Supabase si existe', async () => {
    await act(async () => {
      render(<FotoPerfil userId={userId} />);
    });

    const img = await screen.findByAltText('Foto de perfil');
    expect(img).toHaveAttribute('src', expect.stringContaining('blob:'));
  });

  test('H44T2: Botón Editar permite subir imagen', async () => {
    await act(async () => {
      render(<FotoPerfil userId={userId} />);
    });

    const file = new File(['(⌐□_□)'], 'foto.png', { type: 'image/png' });
    const input = await screen.findByTestId('input-file') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(input.files?.[0]).toEqual(file);
  });

  test('H44T3: Botón Eliminar borra la imagen y muestra placeholder', async () => {
    await act(async () => {
      render(<FotoPerfil userId={userId} />);
    });

    const btnEliminar = screen.getByText('Eliminar');
    fireEvent.click(btnEliminar);

    await waitFor(() => {
      const img = screen.getByAltText('Foto de perfil');
      expect(img).toHaveAttribute('src', expect.stringContaining('placeholder_profile'));
    });
  });
});