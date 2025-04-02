'use client'

import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import ProgresoRecuperacion from "../components/progresoRecuperacion";

export default function OlvideContrasena(){
    const [codigo, setCodigo] = useState(["", "", "", ""]);
    const paso = 2;
    const router = useRouter(); 

    const resetCodigo = () => {
        setCodigo(["", "", "", ""]);
        const firstInput = document.getElementById("input-0");
        if (firstInput) firstInput.focus();
        alert("Código reenviado, revisa tu correo.");
    };

    const handleChange = (index: number, value: string) => {
        if (/^[0-9]?$/.test(value)) {
            const newCodigo = [...codigo];
            newCodigo[index] = value;
            setCodigo(newCodigo);

            if (value !== "" && index < 3) {
                const nextInput = document.getElementById(`input-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const codigoCompleto = codigo.join("");
        if (codigoCompleto.length === 4) {
            router.push("/cambiar-contrasena");
        } else {
            alert("Por favor, ingrese el código completo.");
        }
    };


    return(
        <div className="flex flex-col gap-4 justify-center items-center h-screen text-white bg-[url(/bg_login.png)]">
            <div className="bg-gray-700/85 p-4 rounded-lg w-96 text-white flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-4">Restablece tu contraseña</h2>
                <p className="text-gray-400 text-center mb-4">Te enviamos un correo electrónico con un código.</p>
                <form onSubmit={handleSubmit} className="space-y-4 w-full py-8">
                    <div className="flex flex-col gap-4">
                        <label className="block text-sm font-medium">Ingrese código de 4 digitos</label>
                        <div className="flex gap-2 justify-center">
                            {codigo.map((num, index) => (
                                <input
                                    key={index}
                                    id={`input-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={num}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    className="w-12 h-12 bg-gray-700 border border-gray-600 rounded-md text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 rounded-md hover:from-blue-600 hover:to-blue-700 transition">
                        Seguir
                    </button>
                    <div className="flex flex-col justify-center items-center mt-2">
                        <p className="text-sm text-gray-400">¿No has recibido ningún correo electrónico?</p>
                        <button type="button" onClick={resetCodigo} className="text-blue-500 hover:text-blue-600 underline text-sm mt-1">
                            Volver a enviar.
                        </button>
                    </div>
                </form>
                <ProgresoRecuperacion pasoActual={paso}/>
            </div>
            <div className="flex justify-end">
                <Link href="/" className="text-white hover:text-gray-400 underline">
                    Volver a Inicio de Sesión
                </Link>
            </div>
        </div>
    )
}