'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/dialog';
import { Button } from '@/app/components/boton';

interface Course {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  name: string;
}

interface AssignCoursesProps {
  courses: Course[];
  employees: Employee[];
  onAssign: (courseIds: string[], employeeIds: string[]) => void;
}

export default function AssignCourses({ courses, employees, onAssign }: AssignCoursesProps) {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const handleCourseChange = (id: string) => {
    setSelectedCourses(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleEmployeeChange = (id: string) => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  const handleAssign = () => {
    setShowSummary(true);
  };

  const handleConfirm = () => {
    onAssign(selectedCourses, selectedEmployees);
    setShowSummary(false);
    setSelectedCourses([]);
    setSelectedEmployees([]);
  };

  return (
    <section className="bg-black bg-opacity-80 rounded-lg p-6">
      <span className="inline-block bg-blue-500 text-white rounded-md px-4 py-1 font-semibold mb-4">
        Asignar Cursos
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-white font-semibold mb-2">Selecciona Cursos</h3>
          <ul className="space-y-2">
            {courses.map((course) => (
              <li key={course.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`course-${course.id}`}
                  checked={selectedCourses.includes(course.id)}
                  onChange={() => handleCourseChange(course.id)}
                />
                <label htmlFor={`course-${course.id}`} className="text-gray-300">{course.name}</label>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">Selecciona Empleados</h3>
          <ul className="space-y-2">
            {employees.map((emp) => (
              <li key={emp.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`emp-${emp.id}`}
                  checked={selectedEmployees.includes(emp.id)}
                  onChange={() => handleEmployeeChange(emp.id)}
                />
                <label htmlFor={`emp-${emp.id}`} className="text-gray-300">{emp.name}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Button onClick={handleAssign} disabled={selectedCourses.length === 0 || selectedEmployees.length === 0}>
        Asignar
      </Button>

      {/* Modal de resumen */}
      <Dialog isOpen={showSummary} onClose={() => setShowSummary(false)}>
        <DialogContent className="bg-[#1f1f1f] text-white">
          <DialogHeader>
            <DialogTitle>Resumen de Asignación</DialogTitle>
          </DialogHeader>

          <p className="mb-2 text-gray-400">Cursos seleccionados:</p>
          <ul className="list-disc list-inside mb-4 text-gray-300">
            {selectedCourses.map((id) => {
              const course = courses.find(c => c.id === id);
              return <li key={id}>{course?.name}</li>;
            })}
          </ul>

          <p className="mb-2 text-gray-400">Empleados seleccionados:</p>
          <ul className="list-disc list-inside mb-4 text-gray-300">
            {selectedEmployees.map((id) => {
              const emp = employees.find(e => e.id === id);
              return <li key={id}>{emp?.name}</li>;
            })}
          </ul>

          <DialogFooter>
            <Button onClick={() => setShowSummary(false)}>Volver</Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleConfirm}
            >
              Confirmar Asignación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
