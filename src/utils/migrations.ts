// utils/migrations.ts - Versión final que coincide con tu Employee interface
import { Employee } from '@/app/types/employee';

interface APIEmployee {
  id?: string | number;
  name?: string;
  nombres?: string;
  photo?: string;
  isAdmin?: boolean;
  courses?: {
    completed?: number;
    inProgress?: number;
    notStarted?: number;
    sin_comenzar?: number;
  };
  obligatoryCourses?: {
    completed?: number;
    inProgress?: number;
    notStarted?: number;
    sin_comenzar?: number;
  };
  [key: string]: unknown;
}

/**
 * Convierte la estructura de empleado que viene de tu API actual
 * a la nueva estructura que necesitan los componentes modulares
 */
export const migrateFromOldStructure = (oldEmployee: APIEmployee): Employee => {
  console.log('🔄 DEBUG - Migrando empleado:', oldEmployee.name || oldEmployee.nombres);
  console.log('📊 DEBUG - ID original:', oldEmployee.id, 'tipo:', typeof oldEmployee.id);
  console.log('📊 DEBUG - Cursos originales:', oldEmployee.courses);
  console.log('🎓 DEBUG - Cursos obligatorios originales:', oldEmployee.obligatoryCourses);

  // Validar que tenemos los datos mínimos necesarios
  if (!oldEmployee.id) {
    throw new Error('Employee ID is required');
  }
  if (!oldEmployee.name && !oldEmployee.nombres) {
    throw new Error('Employee name is required');
  }

  // Helper para extraer datos de cursos manejando diferentes nombres de campos
  const extractCourseData = (courseObj: APIEmployee['courses']) => {
    if (!courseObj) {
      console.log('⚠️ DEBUG - No se encontraron datos de cursos');
      return { completed: 0, inProgress: 0, notStarted: 0 };
    }

    const result = {
      completed: Number(courseObj.completed || 0),
      inProgress: Number(courseObj.inProgress || 0),
      notStarted: Number(courseObj.notStarted || courseObj.sin_comenzar || 0),
    };

    console.log('🔧 DEBUG - Valores extraídos:', result);
    return result;
  };

  const migratedEmployee: Employee = {
    id: String(oldEmployee.id), // Mantener como string para UUIDs
    name: oldEmployee.name || oldEmployee.nombres || '',
    photo: oldEmployee.photo || '/placeholder_profile.png',
    courses: extractCourseData(oldEmployee.courses),
    obligatoryCourses: extractCourseData(oldEmployee.obligatoryCourses),
    isAdmin: Boolean(oldEmployee.isAdmin), // Asegurar que sea boolean
  };

  console.log('✅ DEBUG - Empleado migrado:', migratedEmployee);
  return migratedEmployee;
};

/**
 * Valida que los datos del empleado estén completos
 * (opcional - para debugging)
 */
export const validateEmployee = (employee: unknown): employee is Employee => {
  if (!employee || typeof employee !== 'object') {
    return false;
  }

  const emp = employee as Record<string, unknown>;
  
  // Verificaciones básicas
  if (typeof emp.id !== 'string') return false; // Cambiado a string
  if (typeof emp.name !== 'string') return false;
  if (typeof emp.photo !== 'string') return false;
  
  // Validar courses
  if (!emp.courses || typeof emp.courses !== 'object' || emp.courses === null) return false;
  const courses = emp.courses as Record<string, unknown>;
  if (typeof courses.completed !== 'number') return false;
  if (typeof courses.inProgress !== 'number') return false;
  if (typeof courses.notStarted !== 'number') return false;

  // Validar obligatoryCourses
  if (!emp.obligatoryCourses || typeof emp.obligatoryCourses !== 'object' || emp.obligatoryCourses === null) return false;
  const obligatoryCourses = emp.obligatoryCourses as Record<string, unknown>;
  if (typeof obligatoryCourses.completed !== 'number') return false;
  if (typeof obligatoryCourses.inProgress !== 'number') return false;
  if (typeof obligatoryCourses.notStarted !== 'number') return false;

  // Validar isAdmin (opcional)
  if (emp.isAdmin !== undefined && typeof emp.isAdmin !== 'boolean') return false;

  return true;
};

/**
 * Función helper para debuggear la migración
 * (opcional - puedes eliminarla después)
 */
export const debugMigration = (oldData: APIEmployee, newData: Employee): void => {
  console.log('🔄 Migración de empleado:');
  console.log('📊 Datos originales:', oldData);
  console.log('✅ Datos migrados:', newData);
  console.log('🔍 Validación:', validateEmployee(newData) ? 'VÁLIDO' : 'INVÁLIDO');
};

/**
 * Función adicional para debug de la API
 * (para ayudar a encontrar el problema con sin_comenzar)
 */
export function debugAPIResponse(apiData: {
  employees?: APIEmployee[];
  [key: string]: unknown;
}): void {
  console.log('🌐 === DEBUG API RESPONSE ===');
  console.log('📋 Estructura completa:', JSON.stringify(apiData, null, 2));
  
  if (apiData.employees && Array.isArray(apiData.employees)) {
    apiData.employees.forEach((emp, index) => {
      console.log(`\n👤 EMPLEADO ${index + 1}: ${emp.name || emp.nombres}`);
      console.log('📚 Cursos encontrados en:', Object.keys(emp).filter(key => 
        key.toLowerCase().includes('curso') || key.toLowerCase().includes('course')
      ));
      
      // Buscar propiedades relacionadas con cursos
      const coursesData = emp.courses;
      if (coursesData && typeof coursesData === 'object') {
        console.log('📊 Datos de cursos:', coursesData);
        console.log('🔑 Propiedades de cursos:', Object.keys(coursesData));
        
        // Buscar específicamente 'sin_comenzar'
        Object.keys(coursesData).forEach(key => {
          if (key.includes('sin_') || key.includes('not_') || key.includes('empezar') || key.includes('started')) {
            console.log(`🎯 Encontrado campo relacionado: ${key} = ${(coursesData as Record<string, unknown>)[key]}`);
          }
        });
      } else {
        console.log('❌ No se encontraron datos de cursos para este empleado');
      }
    });
  }
  console.log('🌐 === FIN DEBUG API ===\n');
}