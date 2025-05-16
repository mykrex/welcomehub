import React from 'react';

interface AssignCoursesProps {
  courses: { id: string; name: string }[];
  employees: { id: string; name: string }[];
  onAssign: (courseId: string, employeeId: string) => void;
}

export default function AssignCourses({ courses, employees, onAssign }: AssignCoursesProps) {
  return (
    <section className="bg-black bg-opacity-80 rounded-lg p-6">
      <span className="inline-block bg-blue-500 text-white rounded-md px-4 py-1 font-semibold mb-4">
        Asignar Cursos
      </span>

      {courses.length === 0 ? (
        <p className="text-gray-400">No hay cursos disponibles.</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course.id} className="border-b border-gray-700 py-3">
              <p className="font-semibold">Curso: {course.name}</p>
              <select
                onChange={(e) => onAssign(course.id, e.target.value)}
                className="mt-2 bg-gray-800 text-white rounded px-3 py-2 w-full max-w-xs"
                defaultValue=""
              >
                <option value="" disabled>
                  Seleccionar Empleado
                </option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
