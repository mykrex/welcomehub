'use client';

import { useState } from 'react';
import { useUser } from '../app/context/UserContext'
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const { setUser } = useUser();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const validatePassword = (password: string) => {
      const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      return regex.test(password);
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (!email.includes('@')) {
          setError('Invalid email address');
          return;
      }
      
      if (!validatePassword(password)) {
          setError('Password must be at least 8 characters, include one capital letter, and one special character');
          return;
      }

      setUser({ email });
      router.push('/dashboard'); // Redirect to dashboard after login
  };

  return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-black text-white">
          <div className="text-center absolute top-8 text-4xl font-bold">
              <Image
                src="/welcomehub.png"
                alt="Logo"
                width={400}
                height={10}
              />
          </div>
          <div>

          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md w-96 text-white flex flex-col items-center">
              <h2 className="text-2xl font-semibold mb-4">Inicia sesión</h2>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-4 w-full">
                  <div>
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
                  <div>
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
                  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Ingresar</button>
              </form>
          </div>
      </div>
  );
}
