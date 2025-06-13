import FotoPerfil from './fotoPerfil';
import type { User } from '@/app/context/UserContext';
import Titulo from "../(admin)/perfilTitulos";

interface Props {
  profile: User;
}

export default function ProfileInfo({ profile }: Props) {
  return (
    <section className="flex flex-row gap-6 border-b border-gray-500 pb-4">
      <div className="flex-1 space-y-2">
        
        <Titulo title="Información Básica"/>
        
        <p className="text-white font-semibold w-fit">
          Nombre(s): <span className="font-normal text-gray-400 ml-2">{profile.nombres}</span>
        </p>
        <p className="ttext-white font-semibold w-fit">
          Apellido(s): <span className="font-normal text-gray-400 ml-2">{profile.apellidos}</span>
        </p>
        <p className="text-white font-semibold w-fit">
          Fecha de Nacimiento: <span className="font-normal text-gray-400 ml-2">{profile.fecha_nacimiento}</span>
        </p>
        <p className="text-white font-semibold w-fit">
          Puesto: <span className="font-normal text-gray-400 ml-2">{profile.puesto}</span>
        </p>
        <p className="text-white font-semibold w-fit">
          Con Neoris desde: <span className="font-normal text-gray-400 ml-2">{profile.en_neoris_desde}</span>
        </p>
  
      </div>

      <div className="relative w-[180px] h-[180px]">
        <FotoPerfil userId={profile.id_usuario} />
      </div>

    </section>
  );
}