import React from "react";

interface ProgresoRecuperacionProps{
    pasoActual: number;
}

const ProgresoRecuperacion: React.FC<ProgresoRecuperacionProps>=({pasoActual}) =>{
    return(
        <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((paso) => (
                <div key={paso} className={`h-2 w-12 rounded-full ${ 
                    pasoActual === paso ? "bg-blue-500" : "bg-gray-500"
                }`}/>
            ))}
        </div>
    );
}
export default ProgresoRecuperacion;