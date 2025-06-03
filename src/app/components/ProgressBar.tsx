"use client";

type ProgressBarProps = {
  completado: number; // Porcentaje completado
  hechoHoy: number; // Porcentaje hecho hoy
  restante: number; // Porcentaje restante
};

export default function ProgressBar({
  completado,
  hechoHoy,
  restante,
}: ProgressBarProps) {
  return (
    <div className="flex flex-col p-[20px] bg-[#042C45] rounded-[15px]">
      <span className="text-[#448AFF] font-medium text-[40px]">
        {completado}% <span className="text-[30px] font-normal">completado</span>
      </span>
      <div className="w-full bg-gray-700 h-2 rounded-full mt-2 flex">
        <div
          className="bg-[#448AFF] h-2 rounded-full"
          style={{ width: `${completado}%` }}
        ></div>
        <div
          className="bg-[#06D6A0] h-2 rounded-full"
          style={{ width: `${hechoHoy}%` }}
        ></div>
        <div
          className="bg-gray-500 h-2 rounded-full flex-1"
          style={{ width: `${restante}%` }}
        ></div>
      </div>
      <div className="flex justify-center space-x-4 mt-2">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#448AFF] rounded-full mr-2"></div>
          <div className="legend-label">Completado</div>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#06D6A0] rounded-full mr-2"></div>
          <div className="legend-label">Hecho Hoy</div>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-500 rounded-full mr-2"></div>
          <div className="legend-label">Restante</div>
        </div>
      </div>
    </div>
  );
}
