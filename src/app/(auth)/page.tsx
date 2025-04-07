'use client';

import { useState } from 'react';
import { useUser } from '../context/UserContext'
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import Image from 'next/image';
import Link from "next/link";

export default function Home() {
  const { setUser } = useUser();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const emailPattern = /^[^\s@]+@neoris\.mx$/
  const passwordPattern = /^(?=.*[A-Z])(?=.*[\d])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

  const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setError('');

        if (!emailPattern.test(email)) {
            setError('Correo electrónico inválido. Debe ser de neoris.mx');
            return;
        }
        
        if (!passwordPattern.test(password)) {
            setError('La contraseña debe tener entre 8 y 20 caracteres, al menos una letra mayúscula, un número y un símbolo especial.');
            return;
        }

        const { data, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError) {
            setError('Error al iniciar sesión. Verifica tus credenciales.');
            return;
        }

        setUser({ email: data.user.email ?? '' });
        router.push('/dashboard'); // Redirect to dashboard after login
  };

  return (
      <div className="flex flex-col justify-center items-center h-screen text-white bg-[url(/bg_login.png)]">
          <div className="flexjustify-center items-center mb-8">
              <Image
                src="/welcomehub.png"
                alt="Logo"
                width={400}
                height={10}
              />
          </div>
          
          <div className="bg-gray-700/85 p-4 rounded-lg shadow-md w-96 text-white flex flex-col items-center">
              <h2 className="text-2xl font-semibold mb-4">Inicia sesión</h2>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-4 w-full">
                  <div className="flex flex-col gap-2">
                      <label className="block text-sm font-medium">Correo Electrónico</label>
                      <input 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="usuario@neoris.mx"
                          required
                      />
                  </div>
                  <div className="flex flex-col gap-2">
                      <label className="block text-sm font-medium">Contraseña</label>
                      <input 
                          type="password" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="contraseña"
                          required
                      />
                  </div>
                  <div className="flex justify-end">
                    <Link href="/olvide-contrasena" className="text-blue-500 hover:text-blue-600 underline">
                        Olvidé mi contraseña
                    </Link>
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 rounded-md hover:from-blue-600 hover:to-blue-700 transition">Ingresar</button>
              </form>
          </div>
      </div>
  );
}
