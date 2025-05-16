'use client';

import { useCourseData } from '@/app/(authed)/hooksFake/FakeCourseData';
import CourseRequests from '@/app/components/admin/CourseRequest';
import AssignCourses from '@/app/components/admin/AssignCourses';

export default function AdminCoursesPage() {
  const { requests, setRequests, courses, employees } = useCourseData();

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    );
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r))
    );
  };

  const handleAssign = (courseIds: string[], employeeIds: string[]) => {
    alert(`Cursos ${courseIds.join(', ')} asignados a empleados ${employeeIds.join(', ')}`);
  };

  // ✅ TRANSFORMACIÓN: para mostrar correctamente en <CourseRequests />
  const transformedRequests = requests.map((req) => {
    const employee = employees.find((e) => e.id === req.employeeId);
    const course = courses.find((c) => c.id === req.courseId);

    return {
      id: req.id,
      name: employee?.name || 'Desconocido',
      avatar: employee?.avatar || 'avatar1.jpg',
      course: course?.name || 'Curso desconocido',
      status: req.status,
    };
  });

  return (
    <main className="container mx-auto px-4 py-6 text-white">
      <h1 className="text-white text-2xl mb-6">Gestión de Cursos</h1>

      <CourseRequests
        requests={transformedRequests}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <AssignCourses
        courses={courses}
        employees={employees}
        onAssign={handleAssign}
      />
    </main>
  );
}
