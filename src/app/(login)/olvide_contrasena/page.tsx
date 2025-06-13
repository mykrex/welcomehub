'use client'
import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import ProgresoRecuperacion from "../../components/(mi_equipo)/progresoRecuperacion";

export default function OlvideContrasena(){
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const paso = 1;
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/verify_email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        setError(error);
      } else {
        localStorage.setItem('recup_email', email);
        router.push('/cambiar_contrasena');
      }
    } catch (err) {
      console.error("Error al verificar email:", err);
      setError('Hubo un problema al verificar el email.');
    }
  };

  return(
    <div className="flex flex-col gap-4 justify-center items-center h-screen text-white bg-[url(/bg_login.png)]">
      <div className="bg-gray-700/85 p-4 rounded-lg w-96 text-white flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-4">¿Olvidaste tu contraseña?</h2>
        <p className="text-gray-400 text-center">Restablece tu contraseña</p>
        <form onSubmit={handleSubmit} className="space-y-4 w-full py-8">
          <div className="flex flex-col gap-4">
            <label className="block text-sm font-medium">Ingresa tu correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="usuario@neoris.mx"
              required
            />
            {error && (<p className="text-red-500 text-sm mt-1">{error}</p>)}
          </div>
          <button className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 rounded-md hover:from-blue-600 hover:to-blue-700 transition">
            Seguir
          </button>
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