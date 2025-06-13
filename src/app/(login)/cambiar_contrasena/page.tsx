'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProgresoRecuperacion from "../../components/mi_equipo/progresoRecuperacion";

export default function CambiarContrasena() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const paso = 2;
    const router = useRouter();

    useEffect(() => {
        const correoGuardado = localStorage.getItem('recup_email');
        if (!correoGuardado) {
            router.push('/');
        } else {
            setEmail(correoGuardado);
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        
        try {
            const res = await fetch('/api/auth/reset_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword: password }),
            });

            if (!res.ok) {
                const { error } = await res.json();
                setError(error);
            } else {
                localStorage.removeItem('recup_email');
                router.push("/restablecimiento_exitoso");
            }
        } catch (err) {
            console.error("Error al cambiar contraseña:", err);
            setError('Ocurrió un error inesperado. Intenta de nuevo.');
        }
    };

    return (
        <div className="flex flex-col gap-4 justify-center items-center h-screen text-white bg-[url(/bg_login.png)]">
            <div className="bg-gray-700/85 p-6 rounded-lg w-96 text-white flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-2">Establece Nueva Contraseña</h2>
                <p className="text-gray-400 text-center mb-4">Debe tener al menos 8 caracteres, incluida una letra mayúscula, un número y un carácter especial.</p>
                <form onSubmit={handleSubmit} className="space-y-4 w-full py-4">
                    <div className="flex flex-col gap-4">
                        <label className="block text-sm font-medium">Nueva contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nueva contraseña"
                            required
                        />
                        <label className="block text-sm font-medium">Confirmar Contraseña</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirmar contraseña"
                            required
                        />
                        {error && (<p className="text-red-500 text-sm mt-2">{error}</p>)}
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 rounded-md hover:from-blue-600 hover:to-blue-700 transition">
                        Siguiente
                    </button>
                </form>
                <ProgresoRecuperacion pasoActual={paso} />
            </div>
            <div className="mt-4">
                <Link href="/" className="text-white hover:text-gray-400 underline">
                    Regresar a Inicio de Sesión
                </Link>
            </div>
        </div>
    );
}