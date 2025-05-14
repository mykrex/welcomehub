'use client';


import { useState, useEffect } from 'react';
import Titulo from '../../components/perfilTitulos';

interface CourseRequest {
    id: string;
    employeeName: string;
    courseName: string;
    status: 'pending' | 'approved' | 'rejected';
}

interface Course {
    id: string;
    name: string;
}

interface Employee {
    id: string;
    name: string;
}

export default function AdminCourses() {
    const [requests, setRequests] = useState<CourseRequest[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [requestsRes, coursesRes, employeesRes] = await Promise.all([
                    fetch('/api/courses/requests', { credentials: 'include' }),
                    fetch('/api/courses', { credentials: 'include' }),
                    fetch('/api/employees', { credentials: 'include' }),
                ]);

                setRequests(await requestsRes.json());
                setCourses(await coursesRes.json());
                setEmployees(await employeesRes.json());
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleApproveRequest = async (id: string) => {
        try {
            await fetch(`/api/courses/requests/${id}/approve`, {
                method: 'POST',
                credentials: 'include',
            });
            setRequests((prev) =>
                prev.map((req) =>
                    req.id === id ? { ...req, status: 'approved' } : req
                )
            );
        } catch (error) {
            console.error('Error approving request:', error);
        }
    };

    const handleRejectRequest = async (id: string) => {
        try {
            await fetch(`/api/courses/requests/${id}/reject`, {
                method: 'POST',
                credentials: 'include',
            });
            setRequests((prev) =>
                prev.map((req) =>
                    req.id === id ? { ...req, status: 'rejected' } : req
                )
            );
        } catch (error) {
            console.error('Error rejecting request:', error);
        }
    };

    const handleAssignCourse = async (courseId: string, employeeId: string) => {
        try {
            await fetch('/api/courses/assign', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId, employeeId }),
            });
            alert('Curso asignado exitosamente');
        } catch (error) {
            console.error('Error assigning course:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-white">
                <p className="text-lg animate-pulse">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto">
            <main className="container mx-auto px-4 py-6">
                <h1 className="text-white text-semibold text-2xl mb-6">Gestión de Cursos</h1>

                <section className="bg-[#141414] rounded-xl p-6 text-white mb-6">
                    <Titulo title="Solicitudes de Cursos" />
                    {requests.length === 0 ? (
                        <p className="text-gray-400">No hay solicitudes pendientes.</p>
                    ) : (
                        <ul>
                            {requests.map((req) => (
                                <li key={req.id} className="border-b border-gray-500 py-2">
                                    <p>
                                        <span className="font-semibold">Empleado:</span> {req.employeeName}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Curso:</span> {req.courseName}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Estado:</span>{' '}
                                        <span
                                            className={
                                                req.status === 'approved'
                                                    ? 'text-green-400'
                                                    : req.status === 'rejected'
                                                    ? 'text-red-400'
                                                    : 'text-yellow-400'
                                            }
                                        >
                                            {req.status}
                                        </span>
                                    </p>
                                    {req.status === 'pending' && (
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => handleApproveRequest(req.id)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                            >
                                                Aprobar
                                            </button>
                                            <button
                                                onClick={() => handleRejectRequest(req.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                            >
                                                Rechazar
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
                <section className="bg-[#141414] rounded-xl p-6 text-white">
                    <Titulo title="Asignar Cursos" />
                    {courses.length === 0 ? (
                        <p className="text-gray-400">No hay cursos disponibles.</p>
                    ) : (
                        <ul>
                            {courses.map((course) => (
                                <li key={course.id} className="border-b border-gray-500 py-2">
                                    <div>
                                        <p>
                                            <span className="font-semibold">Curso:</span> {course.name}
                                        </p>
                                        <select
                                            onChange={(e) =>
                                                handleAssignCourse(course.id, e.target.value)
                                            }
                                            className="mt-2 bg-gray-700 text-white rounded px-4 py-2"
                                        >
                                            <option value="">Seleccionar Empleado</option>
                                            {employees.map((employee) => (
                                                <option key={employee.id} value={employee.id}>
                                                    {employee.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </main>
        </div>
    );
}
