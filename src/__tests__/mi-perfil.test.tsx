import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MiPerfil from '@/app/(authed)/mi_perfil/page';
import { UserProvider } from '@/app/context/UserContext';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock('@/lib/supabase', () => {
  return {
    supabase: {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: { user: { id: '123', email: 'ana@neoris.mx' } } },
          error: null,
        }),
      },
      from: jest.fn((table: string) => ({
        select: () => ({
          eq: () => ({
            single: async () => {
              if (table === 'usuario') {
                return {
                  data: {
                    id_usuario: '123',
                    nombres: 'Ana',
                    apellidos: 'Martínez',
                    email: 'ana@neoris.mx',
                    puesto: 'Desarrolladora',
                    telefono: '555-1234',
                    fecha_nacimiento: '2000-01-01',
                    en_neoris_desde: '2021-06-15',
                  },
                  error: null,
                };
              }

              if (table === 'equipo_trabajo') {
                return {
                  data: {
                    equipo: 'Equipo A',
                    administrador: 'ana@neoris.mx',
                    miembros: [
                      {
                        nombres: 'Ana',
                        apellidos: 'Martínez',
                        email: 'ana@neoris.mx',
                        puesto: 'Desarrolladora',
                      },
                      {
                        nombres: 'Luis',
                        apellidos: 'Gómez',
                        email: 'luis@neoris.mx',
                        puesto: 'Líder Técnico',
                      },
                    ],
                  },
                  error: null,
                };
              }

              return { data: null, error: 'Tabla no encontrada' };
            },
          }),
        }),
      })),
    },
  };
});

describe('HU-17: Mi perfil', () => {
  test('1. Muestra información básica del usuario', async () => {
    render(
      <UserProvider>
        <MiPerfil />
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Cargando perfil/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Nombre\(s\):/i)).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Desarrolladora')).toBeInTheDocument();
  });

  test('2. Muestra equipo de trabajo con admin y miembros', async () => {
    render(
      <UserProvider>
        <MiPerfil />
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Cargando perfil/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Equipo A')).toBeInTheDocument();
    expect(screen.getByText('Ana Martínez')).toBeInTheDocument();
    expect(screen.getByText('luis@neoris.mx')).toBeInTheDocument();
  });
});