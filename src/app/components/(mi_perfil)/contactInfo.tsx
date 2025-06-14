import type { MouseEventHandler } from "react";
import Titulo from "../(admin)/perfilTitulos";

interface Props {
  correo: string;
  telefono?: string;
  onChangePassword: MouseEventHandler<HTMLButtonElement>;
}

export default function ContactInfo({
  correo,
  telefono,
  onChangePassword,
}: Props) {
  return (
    <section className="grid gap-2 p-2 border-b border-gray-500">
      <Titulo title="Contacto" />

      <p className="text-white font-semibold w-fit">
        Correo electrónico:{" "}
        <span className="font-normal text-gray-400 ml-2">{correo}</span>
      </p>
      <p className="text-white font-semibold w-fit">
        Teléfono:{" "}
        <span className="font-normal text-gray-400 ml-2">{telefono}</span>
      </p>

      <div className="flex flex-row">
        <button
          onClick={onChangePassword}
          className="text-sm text-white font-semibold text-center p-1 rounded-full bg-cyan-600 hover:bg-cyan-700"
        >
          Cambiar contraseña
        </button>
      </div>
    </section>
  );
}
