import { Employee } from "@/app/types/employee";

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

export const migrateFromOldStructure = (oldEmployee: APIEmployee): Employee => {
  if (!oldEmployee.id) {
    throw new Error("Employee ID is required");
  }
  if (!oldEmployee.name && !oldEmployee.nombres) {
    throw new Error("Employee name is required");
  }

  const extractCourseData = (courseObj: APIEmployee["courses"]) => {
    if (!courseObj) {
      console.log("No se encontraron datos de cursos");
      return { completed: 0, inProgress: 0, notStarted: 0 };
    }

    const notStartedValue =
      courseObj.notStarted !== undefined
        ? courseObj.notStarted
        : courseObj.sin_comenzar !== undefined
        ? courseObj.sin_comenzar
        : 0;

    const result = {
      completed: Number(courseObj.completed || 0),
      inProgress: Number(courseObj.inProgress || 0),
      notStarted: Number(notStartedValue),
    };

    console.log("DEBUG - Valores extraídos:", {
      completed: courseObj.completed,
      inProgress: courseObj.inProgress,
      notStarted: courseObj.notStarted,
      sin_comenzar: courseObj.sin_comenzar,
      resultado: result,
    });

    return result;
  };

  const migratedEmployee: Employee = {
    id: String(oldEmployee.id),
    name: oldEmployee.name || oldEmployee.nombres || "",
    photo: oldEmployee.photo || "/placeholder_profile.png",
    courses: extractCourseData(oldEmployee.courses),
    obligatoryCourses: extractCourseData(oldEmployee.obligatoryCourses),
    isAdmin: Boolean(oldEmployee.isAdmin),
  };

  console.log(
    "DEBUG - Empleado migrado:",
    JSON.stringify(migratedEmployee, null, 2)
  );
  return migratedEmployee;
};

export const validateEmployee = (employee: unknown): employee is Employee => {
  if (!employee || typeof employee !== "object") {
    return false;
  }

  const emp = employee as Record<string, unknown>;

  if (typeof emp.id !== "string") return false;
  if (typeof emp.name !== "string") return false;
  if (typeof emp.photo !== "string") return false;

  if (!emp.courses || typeof emp.courses !== "object" || emp.courses === null)
    return false;
  const courses = emp.courses as Record<string, unknown>;
  if (typeof courses.completed !== "number") return false;
  if (typeof courses.inProgress !== "number") return false;
  if (typeof courses.notStarted !== "number") return false;

  if (
    !emp.obligatoryCourses ||
    typeof emp.obligatoryCourses !== "object" ||
    emp.obligatoryCourses === null
  )
    return false;
  const obligatoryCourses = emp.obligatoryCourses as Record<string, unknown>;
  if (typeof obligatoryCourses.completed !== "number") return false;
  if (typeof obligatoryCourses.inProgress !== "number") return false;
  if (typeof obligatoryCourses.notStarted !== "number") return false;

  if (emp.isAdmin !== undefined && typeof emp.isAdmin !== "boolean")
    return false;

  return true;
};
