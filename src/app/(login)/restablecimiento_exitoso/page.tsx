'use client'

import {useRouter} from "next/navigation";
import Image from "next/image";
import ProgresoRecuperacion from "../../components/(mi_equipo)/progresoRecuperacion";

export default function OlvideContrasena(){
    const paso = 3;
    const router = useRouter();

    const handleNext = () => {
        router.push("/login");
    };

    return(
        <div className="flex flex-col gap-4 justify-center items-center h-screen text-white bg-[url(/bg_login.png)]">
            <div className="bg-gray-700/85 p-4 rounded-lg w-96 text-white flex flex-col items-center">
                <h2 className="text-2xl font-semibold text-center mb-4 break-words whitespace-normal">Restablecimiento de Contraseña Exitoso!</h2>
                <div className="mb-4">
                    <Image
                        src="/cambioexitoso.png"
                        alt="restablecimiento de contrasena exitoso"
                        width={200}
                        height={200}
                    />
                </div>
                <button onClick={handleNext} className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 rounded-md hover:from-blue-600 hover:to-blue-700 transition">
                    Volver a Inicio de Sesión
                </button>
                <ProgresoRecuperacion pasoActual={paso}/>
            </div>
        </div>
    )
}