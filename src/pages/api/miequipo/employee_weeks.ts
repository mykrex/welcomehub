// pages/api/miequipo/employee_weeks.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { WeekData, ProjectInfo } from '@/app/types/employee';

interface EmployeeWeeksResponse {
  weeks: WeekData[];
  proyectosDisponibles: ProjectInfo[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmployeeWeeksResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { employeeId } = req.query;
    
    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }

    console.log('🔍 API: Obteniendo semanas para empleado ID:', employeeId);
    
    // TODO: Aquí debes conectar con tu base de datos real
    // Por ahora, datos de ejemplo para testing:
    
    const mockWeeks: WeekData[] = [
      {
        id_semana: 1,
        id_usuario: String(employeeId),
        inicio_semana: '2025-05-26', // Esta semana
        fin_semana: '2025-06-01',
        enviado_el: '2025-05-29T10:00:00Z',
        estado: 'enviado',
        aprobado_por: null,
        aprobado_el: null,
        horas_totales: 43,
        dias: [
          {
            fecha_trabajada: '2025-05-26',
            proyectos: [
              { id_proyecto: 'proj-001', nombre_proyecto: 'Mobile App Revamp', horas: 6 },
              { id_proyecto: 'proj-002', nombre_proyecto: 'DevOps Automation', horas: 2 }
            ],
            total_horas: 8
          },
          {
            fecha_trabajada: '2025-05-27',
            proyectos: [
              { id_proyecto: 'proj-001', nombre_proyecto: 'Mobile App Revamp', horas: 4 },
              { id_proyecto: 'proj-003', nombre_proyecto: 'Blockchain Integration', horas: 4 }
            ],
            total_horas: 8
          },
          {
            fecha_trabajada: '2025-05-28',
            proyectos: [
              { id_proyecto: 'proj-002', nombre_proyecto: 'DevOps Automation', horas: 6 },
              { id_proyecto: 'proj-003', nombre_proyecto: 'Blockchain Integration', horas: 2 }
            ],
            total_horas: 8
          },
          {
            fecha_trabajada: '2025-05-29',
            proyectos: [
              { id_proyecto: 'proj-001', nombre_proyecto: 'Mobile App Revamp', horas: 5 },
              { id_proyecto: 'proj-004', nombre_proyecto: 'Cybersecurity Audit', horas: 3 }
            ],
            total_horas: 8
          },
          {
            fecha_trabajada: '2025-05-30',
            proyectos: [
              { id_proyecto: 'proj-004', nombre_proyecto: 'Cybersecurity Audit', horas: 7 }
            ],
            total_horas: 7
          },
          {
            fecha_trabajada: '2025-05-31',
            proyectos: [
              { id_proyecto: 'proj-002', nombre_proyecto: 'DevOps Automation', horas: 4 },
              { id_proyecto: 'proj-003', nombre_proyecto: 'Blockchain Integration', horas: 2 }
            ],
            total_horas: 6
          },
          {
            fecha_trabajada: '2025-06-01',
            proyectos: [
              { id_proyecto: 'proj-001', nombre_proyecto: 'Mobile App Revamp', horas: 6 }
            ],
            total_horas: 6
          }
        ]
      },
      {
        id_semana: 2,
        id_usuario: String(employeeId),
        inicio_semana: '2025-05-19',
        fin_semana: '2025-05-25',
        enviado_el: '2025-05-22T15:30:00Z',
        estado: 'aprobado',
        aprobado_por: 'admin-001',
        aprobado_el: '2025-05-23T09:00:00Z',
        horas_totales: 40,
        dias: [
          {
            fecha_trabajada: '2025-05-19',
            proyectos: [
              { id_proyecto: 'proj-001', nombre_proyecto: 'Mobile App Revamp', horas: 8 }
            ],
            total_horas: 8
          },
          {
            fecha_trabajada: '2025-05-20',
            proyectos: [
              { id_proyecto: 'proj-002', nombre_proyecto: 'DevOps Automation', horas: 8 }
            ],
            total_horas: 8
          },
          {
            fecha_trabajada: '2025-05-21',
            proyectos: [
              { id_proyecto: 'proj-003', nombre_proyecto: 'Blockchain Integration', horas: 8 }
            ],
            total_horas: 8
          },
          {
            fecha_trabajada: '2025-05-22',
            proyectos: [
              { id_proyecto: 'proj-004', nombre_proyecto: 'Cybersecurity Audit', horas: 8 }
            ],
            total_horas: 8
          },
          {
            fecha_trabajada: '2025-05-23',
            proyectos: [
              { id_proyecto: 'proj-001', nombre_proyecto: 'Mobile App Revamp', horas: 8 }
            ],
            total_horas: 8
          },
          {
            fecha_trabajada: '2025-05-24',
            proyectos: [],
            total_horas: 0
          },
          {
            fecha_trabajada: '2025-05-25',
            proyectos: [],
            total_horas: 0
          }
        ]
      }
    ];

    const mockProjects: ProjectInfo[] = [
      { id_proyecto: 'proj-001', nombre: 'Mobile App Revamp' },
      { id_proyecto: 'proj-002', nombre: 'DevOps Automation' },
      { id_proyecto: 'proj-003', nombre: 'Blockchain Integration' },
      { id_proyecto: 'proj-004', nombre: 'Cybersecurity Audit' }
    ];

    // Aquí es donde conectarías con tu base de datos real:
    /*
    const weeks = await db.collection('weeks')
      .where('id_usuario', '==', employeeId)
      .orderBy('inicio_semana', 'desc')
      .get();
    
    const projects = await db.collection('projects').get();
    */

    const responseData: EmployeeWeeksResponse = {
      weeks: mockWeeks,
      proyectosDisponibles: mockProjects
    };

    console.log('✅ API: Enviando datos de semanas:', responseData);

    res.status(200).json(responseData);
    
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({ error: 'Error al obtener datos de semanas' });
  }
}