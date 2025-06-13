'use client';

import { useUser } from '@/app/context/UserContext';
import { useUserProfile } from '@/app/hooks/useUserProfile';
import { useUserTeam } from '@/app/hooks/useUserTeam';

import ProfileInfo from '@/app/components/(mi_perfil)/profileInfo';
import ContactInfo from '@/app/components/(mi_perfil)/contactInfo';
import TeamSection from '@/app/components/mi_equipo/teamSection';

import LoadingSpinner from '@/app/components/(mi_perfil)/loadingSpinner';

import { useRouter } from 'next/navigation';
import { useChat } from '@/app/context/ChatContext';

export default function MiPerfil() {
  const { profile, loading: l1 } = useUserProfile();
  const { teamData, loading: l2 } = useUserTeam();

  const { setUser } = useUser();
  const { resetMessages } = useChat();

  const router = useRouter();

  if (l1 || l2) return <LoadingSpinner />;
  if (!profile || !teamData) return <p>Error al cargar los datos</p>;

  const members = teamData.miembros.map(m => ({
    nombre: `${m.nombres} ${m.apellidos}`,
    correo: m.email,
    puesto: m.puesto,
    isAdmin: m.email === teamData.administrador,
  }))
  .sort((a, b) => a.isAdmin ? -1 : b.isAdmin ? 1 : 0);

  return (
    <div className="flex-1 overflow-auto">
      <main className="container mx-auto px-4 py-6">
        
        <h1 className="text-white text-semibold text-2xl mb-6">Mi perfil</h1>
        
        <div className="bg-[#141414] rounded-xl p-6 text-white">
          
          <ProfileInfo profile={profile} />
          
          <ContactInfo correo={profile.email} telefono={profile.telefono} onChangePassword={() => router.push('/olvide_contrasena')} />
          
          <TeamSection teamName={teamData.equipo} members={members} />
          
          <section className="flex justify-center">
            <button
              onClick={async () => {
                try {
                  await fetch('/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
                  });
                  resetMessages();
                  setUser(null);
                  router.push('/login');
                } catch (error) {
                  console.error('Error al cerrar sesión:', error);
                }
              }}
              className="mt-8 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded">
                Cerrar sesión
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}