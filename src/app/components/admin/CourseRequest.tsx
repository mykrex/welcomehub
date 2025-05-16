import React from 'react';

interface CourseRequestProps {
  requests: {
    id: string;
    employeeName: string;
    courseName: string;
    status: 'pending' | 'approved' | 'rejected';
  }[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function CourseRequests({ requests, onApprove, onReject }: CourseRequestProps) {
  return (
    <section className="bg-black bg-opacity-80 rounded-lg p-6 mb-6">
      <span className="inline-block bg-blue-500 text-white rounded-md px-4 py-1 font-semibold mb-4">
        Solicitudes de Cursos
      </span>

      {requests.length === 0 ? (
        <p className="text-gray-400">No hay solicitudes pendientes.</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li key={req.id} className="border-b border-gray-700 py-3">
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
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => onApprove(req.id)}
                    className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => onReject(req.id)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2"
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
  );
}
