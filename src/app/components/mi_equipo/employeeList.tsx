import React from "react";
import Image from "next/image";
import { Employee } from "@/app/types/employee";

interface EmployeeListProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  title: string;
  subtitle: string;
  onEmployeeSelect?: (employee: Employee) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  isOpen,
  onClose,
  employees,
  title,
  subtitle,
  onEmployeeSelect,
}) => {
  if (!isOpen) return null;

  const getEmployeeProgress = (employee: Employee) => {
    const completedCourses = employee.obligatoryCourses.completed;
    const totalRequired = 6;
    return `${completedCourses}/${totalRequired}`;
  };

  const getProgressPercentage = (employee: Employee) => {
    const completedCourses = employee.obligatoryCourses.completed;
    const totalRequired = 6;
    return Math.round((completedCourses / totalRequired) * 100);
  };

  const handleEmployeeClick = (employee: Employee) => {
    if (onEmployeeSelect) {
      onEmployeeSelect(employee);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop sutil - solo para cerrar al hacer click fuera */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Popup flotante */}
      <div className="fixed top-4 right-4 z-50 w-96 max-h-[80vh] bg-gray-800 rounded-xl shadow-2xl border border-gray-600 animate-in slide-in-from-top-2 duration-300">
        {/* Header*/}
        <div className="p-4 border-b border-gray-600 relative">
          <h3 className="text-lg font-bold text-white truncate pr-8">
            {title}
          </h3>
          <p className="text-gray-400 text-sm">{subtitle}</p>
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white hover:bg-gray-600 rounded p-1 transition-colors"
            onClick={onClose}
          >
            <span className="text-lg">✕</span>
          </button>
        </div>

        {/* Lista de los empleados */}
        <div className="max-h-96 overflow-y-auto p-3">
          <div className="space-y-2">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className={`flex items-center justify-between bg-gray-700 rounded-lg p-3 transition-all duration-200 ${
                  onEmployeeSelect
                    ? "cursor-pointer hover:bg-gray-600 hover:shadow-md"
                    : ""
                }`}
                onClick={() => handleEmployeeClick(employee)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Image
                    src={employee.photo}
                    alt={employee.name}
                    width={40}
                    height={40}
                    className="rounded-full flex-shrink-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder_profile.png";
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-white font-medium text-sm truncate">
                      {employee.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      {employee.isAdmin && (
                        <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                          Admin
                        </span>
                      )}
                      <span className="text-gray-400 text-xs">
                        {getEmployeeProgress(employee)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <div className="text-blue-400 font-bold text-sm mb-1">
                    {getProgressPercentage(employee)}%
                  </div>
                  <div className="w-16 h-1.5 bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        getProgressPercentage(employee) === 100
                          ? "bg-green-500"
                          : "bg-orange-500"
                      }`}
                      style={{ width: `${getProgressPercentage(employee)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer informativo :b */}
        {onEmployeeSelect && (
          <div className="p-3 border-t border-gray-600 bg-gray-750 rounded-b-xl">
            <p className="text-gray-400 text-xs text-center">
              Click en cualquier empleado para ver sus detalles
            </p>
          </div>
        )}
      </div>
    </>
  );
};
