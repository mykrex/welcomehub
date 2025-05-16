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

  const handleAssign = (courseId: string, employeeId: string) => {
    alert(`Curso ${courseId} asignado a empleado ${employeeId}`);
  };

  return (
    <main className="container mx-auto px-4 py-6 text-white">
      <h1 className="text-white text-2xl mb-6">Gestión de Cursos</h1>
      <CourseRequests requests={requests} onApprove={handleApprove} onReject={handleReject} />
      <AssignCourses courses={courses} employees={employees} onAssign={handleAssign} />
    </main>
  );
}
