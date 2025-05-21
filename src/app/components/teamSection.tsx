import { Fragment } from 'react';
import Titulo from "./perfilTitulos";

type TeamMember = {
  nombre: string;
  correo: string;
  puesto: string;
  isAdmin: boolean;
};

interface Props {
  teamName: string;
  members: TeamMember[];
}

export default function TeamSection({ teamName, members }: Props) {
  return (
    <section className="p-2 border-b border-gray-500 mt-4 space-y-2">
      
      <Titulo title="Mi Equipo"/>
      
      <p className="text-gray-300 mb-2">{teamName || 'Equipo sin nombre'}</p>
      
      <div className="grid [grid-template-columns:1fr_2fr_3fr] gap-y-2">
        {members.map((m, i) => (
          <Fragment key={i}>
            <p>
              <span className="font-semibold">Puesto: </span>
              <span className={m.isAdmin ? 'text-teal-400 font-semibold' : 'text-gray-400 font-normal'}>
                {m.puesto}
              </span>
            </p>

            <p>
              <span className="font-semibold">Nombre: </span>
              <span className="text-gray-400 font-normal">{m.nombre}</span>
            </p>

            <p>
              <span className="font-semibold">Correo: </span>
              <a href={`mailto:${m.correo}`} className="text-blue-400 underline">
                {m.correo}
              </a>
            </p>
          </Fragment>
        ))}
      </div>
      
    </section>
  );
}