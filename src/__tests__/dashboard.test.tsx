import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '@/app/(authed)/dashboard/page';
import { useCourses } from '@/app/hooks/useCourses';

// Mock the useCourses hook
jest.mock('@/app/hooks/useCourses');
const mockUseCourses = useCourses as jest.MockedFunction<typeof useCourses>;

// Mock Next.js components
jest.mock('next/head', () => {
  return function Head({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  };
});

jest.mock('next/image', () => {
  return function Image({ src, alt, ...props }: React.ComponentProps<'img'>) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  };
});

jest.mock('next/link', () => {
  return function Link({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) {
    return <a href={href} {...props}>{children}</a>;
  };
});

describe('Dashboard', () => {
  const mockCursosData = [
    {
      id_curso: '1',
      titulo: 'Customer Service and Sales',
      descripcion: 'Basic customer service course',
      estado: 'en_progreso' as const,
      obligatorio: true,
      portada: '/curso1.jpg',
      duracion: 120,
      ruta_archivo: '/files/curso1.pdf',
      last_updated: '2024-01-15T10:00:00Z'
    },
    {
      id_curso: '2',
      titulo: 'Introduction to Excel',
      descripcion: 'Excel fundamentals',
      estado: 'completado' as const,
      obligatorio: true,
      portada: '/curso2.jpg',
      duracion: 90,
      ruta_archivo: '/files/curso2.pdf',
      last_updated: '2024-01-10T15:30:00Z'
    },
    {
      id_curso: '3',
      titulo: 'Leadership and Team Management',
      descripcion: 'Leadership skills development',
      estado: 'sin_comenzar' as const,
      obligatorio: false,
      portada: '/curso3.jpg',
      duracion: 180,
      ruta_archivo: '/files/curso3.pdf',
      last_updated: undefined
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Shows loading spinner while loading data', () => {
    mockUseCourses.mockReturnValue({
      cursosInscritos: null,
      cursosOpcionales: null,
      cursosRecomendados: null,
      loading: true,
      error: null
    });

    render(<Dashboard />);
    
    expect(screen.getByText('Cargando dashboard...')).toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  test('Renders complete dashboard with course data', async () => {
    mockUseCourses.mockReturnValue({
      cursosInscritos: mockCursosData,
      cursosOpcionales: null,
      cursosRecomendados: null,
      loading: false,
      error: null
    });

    render(<Dashboard />);

    await waitFor(() => {
      // Verify that total progress title is shown
      expect(screen.getByText('Progreso Total')).toBeInTheDocument();
      
      // Verify that onboarding progress is shown
      expect(screen.getByText('Progreso Onboarding')).toBeInTheDocument();
    });
  });

  test('Shows total progress calculated correctly', async () => {
    mockUseCourses.mockReturnValue({
      cursosInscritos: mockCursosData,
      cursosOpcionales: null,
      cursosRecomendados: null,
      loading: false,
      error: null
    });

    render(<Dashboard />);

    await waitFor(() => {
      // With 3 courses and 1 completed = 33% completed, 67% remaining
      expect(screen.getByText('33% Completado')).toBeInTheDocument();
      expect(screen.getByText('67% Restante')).toBeInTheDocument();
    });
  });

  test('Shows onboarding progress only for mandatory courses', async () => {
    mockUseCourses.mockReturnValue({
      cursosInscritos: mockCursosData,
      cursosOpcionales: null,
      cursosRecomendados: null,
      loading: false,
      error: null
    });

    render(<Dashboard />);

    await waitFor(() => {
      // 2 mandatory courses, 1 completed = 50%
      expect(screen.getByText('50')).toBeInTheDocument(); // percentage
      expect(screen.getByText('1 de 2 cursos completados')).toBeInTheDocument();
    });
  });

  test('Shows most recent course in progress', async () => {
    mockUseCourses.mockReturnValue({
      cursosInscritos: mockCursosData,
      cursosOpcionales: null,
      cursosRecomendados: null,
      loading: false,
      error: null
    });

    render(<Dashboard />);

    await waitFor(() => {
      // The most recent course in progress should be displayed
      expect(screen.getByText('Continuar donde lo deje:')).toBeInTheDocument();
      expect(screen.getByText('Continuar Curso')).toBeInTheDocument();
      
      // Check for the course title in the recent course section specifically
      const recentCourseSection = document.querySelector('.recent-course-wrapper');
      const courseTitle = recentCourseSection?.querySelector('.rc-course-title');
      expect(courseTitle).toHaveTextContent('Customer Service and Sales');
    });
  });

  test('Handles state when there are no courses', async () => {
    mockUseCourses.mockReturnValue({
      cursosInscritos: [],
      cursosOpcionales: null,
      cursosRecomendados: null,
      loading: false,
      error: null
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('No hay cursos inscritos')).toBeInTheDocument();
      expect(screen.getByText('0% Completado')).toBeInTheDocument();
      expect(screen.getByText('No hay cursos disponibles')).toBeInTheDocument();
    });
  });

  test('Shows error message when there are problems loading courses', async () => {
    mockUseCourses.mockReturnValue({
      cursosInscritos: null,
      cursosOpcionales: null,
      cursosRecomendados: null,
      loading: false,
      error: 'Connection error'
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar cursos: Connection error')).toBeInTheDocument();
    });
  });

  test('Renders main dashboard components', async () => {
    mockUseCourses.mockReturnValue({
      cursosInscritos: mockCursosData,
      cursosOpcionales: null,
      cursosRecomendados: null,
      loading: false,
      error: null
    });

    render(<Dashboard />);

    await waitFor(() => {
      // Verify that all main components are present
      expect(screen.getByText('Progreso Total')).toBeInTheDocument(); // ProgressBar
      expect(screen.getByText('Progreso Onboarding')).toBeInTheDocument(); // OnboardingStats
      expect(screen.getByText('Continuar donde lo deje:')).toBeInTheDocument(); // RecentCourse
      
      // CursosVista should render the course list - verify the section exists
      expect(screen.getByText('Todos mis Cursos')).toBeInTheDocument();
      expect(screen.getByText('Filtrar por:')).toBeInTheDocument();
    });
  });

  test('Recent course links work correctly', async () => {
    mockUseCourses.mockReturnValue({
      cursosInscritos: mockCursosData,
      cursosOpcionales: null,
      cursosRecomendados: null,
      loading: false,
      error: null
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Continuar Curso')).toBeInTheDocument();
      expect(screen.getByText('Continuar Curso').closest('a')).toHaveAttribute('href', '/cursos/1');
    });
  });
});