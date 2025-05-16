'use client';

import { useState, useEffect } from 'react';

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

export function useCourseData() {
  const [requests, setRequests] = useState<CourseRequest[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    // Hardcoded temporal para demo
    setRequests([
      { id: '1', employeeName: 'Ana', courseName: 'React', status: 'pending' },
    ]);
    setCourses([{ id: 'c1', name: 'React' }]);
    setEmployees([{ id: 'e1', name: 'Ana' }]);
  }, []);

  return { requests, setRequests, courses, employees };
}
