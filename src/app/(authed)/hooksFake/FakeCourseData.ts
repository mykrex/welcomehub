'use client';

import { useState, useEffect } from 'react';

interface CourseRequest {
  id: string;
  employeeId: string; 
  courseId: string;   
  status: 'pending' | 'approved' | 'rejected';
}

interface Course {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  name: string;
  avatar: string;  // nombre de archivo de avatar, ej: "avatar1.jpg"
}

export function useCourseData() {
  const [requests, setRequests] = useState<CourseRequest[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    // Datos de prueba hardcoded
    setRequests([
      { id: '1', employeeId: 'e1', courseId: 'c1', status: 'pending' },
    ]);
    setCourses([{ id: 'c1', name: 'React' }]);
    setEmployees([{ id: 'e1', name: 'Ana', avatar: 'avatar1.jpg' }]);
  }, []);

  return { requests, setRequests, courses, employees };
}
