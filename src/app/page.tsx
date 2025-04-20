'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LandingPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login')
  }

  const repetitions = 6;

  return (
    <div className="min-h-screen bg-[#000F14] text-white flex items-center justify-center relative overflow-hidden px-6">
      <div className="absolute right-0 top-0 h-full w-[300px] flex gap-4 pr-4 z-0">
        <div className="h-full w-[140px] overflow-hidden relative">
          {[...Array(repetitions)].map((_, i) => (
            <Image key={`col1-${i}`} src="/element.svg" alt="Decoración azul" width={150} height={600} 
            className="absolute bottom-[-600px] animate-[scrollInfinite_12s_linear_infinite]" style={{ animationDelay: `${i * 4}s` }}/>
          ))}
        </div>

        <div className="h-full w-[140px] overflow-hidden relative">
          {[...Array(repetitions)].map((_, i) => (
            <Image key={`col2-${i}`} src="/element.svg" alt="Decoración azul" width={150} height={600} 
            className="absolute bottom-[-600px] animate-[scrollInfinite_12s_linear_infinite]" style={{ animationDelay: `${(i * 4) + 2}s` }}/>
          ))}
        </div>
      </div>

      <div className="max-w-xl z-10">
        <Image src="/welcomehub.png" alt="Welcomehub Logo" width={200} height={40} className="mb-8" />

        <h1 className="text-4xl sm:text-5xl font-light leading-tight mb-4">
          Tu camino, <span className="font-semibold text-white">nuestra guía</span>
        </h1>

        <p className="text-gray-300 text-lg mb-8">
          Empieza tu recorrido con el apoyo que necesitas, diseñada para impulsar tu crecimiento profesional.
        </p>

        <button onClick={handleLogin} style={{ backgroundColor: '#0B88D5' }} className="hover:brightness-110 transition-colors text-white font-medium px-6 py-3 rounded-full text-lg shadow-lg">
          Inicia Sesión
        </button>
      </div>
    </div>
  )
}
