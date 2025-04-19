'use client'

import Titulo from "../../../components/perfilTitulos";
import VerPassword from "../../../components/verPassword";
import { useState, useEffect, Fragment } from "react";
import {getBasicInfo } from "../../../api/perfil/informacionBasica";
import {getContact} from "../../../api/perfil/contact";
import {getTeam} from "../../../api/perfil/team";

interface Info {
    nombre: string;
    apellido: string;
    fechaNacimiento: string;
    puesto: string;
    fechaIngreso: string;
}

interface Contact {
    correo: string;
    telefono: string;
    password: string;
}

interface TeamMember {
    rol: string;
    nombre: string;
    correo: string;
}

export default function MiPerfil() {
    const [info, setInfo] = useState<Info | null>(null);
    const [contact, setContact] = useState<Contact | null>(null);
    const [team, setTeam] = useState<TeamMember[]>([]);

    // Get data when the components is loading
    useEffect(() => {
        const fetchData = async () => {
            try {
                const infoResponse = await getBasicInfo();
                setInfo(infoResponse);

                const contactResponse = await getContact();
                setContact(contactResponse);

                const teamResponse = await getTeam();
                setTeam(teamResponse);
            } catch(error) {
                console.log("Error obteniendo los datos: ", error);
            }
        };
        fetchData();
    }, []);

    return (
            <div className="flex-1 overflow-auto">
                <main className="container mx-auto px-4 py-6">
                    <h1 className="text-white text-semibold text-2xl">Mi perfil</h1>
                    <div className="space-y-6 p-4 rounded-xl text-white" style={{backgroundColor: "#141414"}}>
                        {info ? (
                            <>
                            {/* Informacion Basica */}
                            <section className="grid gap-2 p-2 border-b border-gray-500">
                                <Titulo title="Información Básica"/>
                                <p className="text-white font-semibold w-fit">
                                    Nombre(s):
                                    <span className="font-normal text-gray-400 ml-2">{info.nombre}</span>
                                </p>
                                <p className="text-white font-semibold w-fit">
                                    Apellido(s)
                                    <span className="font-normal text-gray-400 ml-2">{info.apellido}</span>
                                </p>
                                <p className="text-white font-semibold w-fit">
                                    Fecha de Nacimiento:
                                    <span className="font-normal text-gray-400 ml-2">{info.fechaNacimiento}</span>
                                </p>
                                <p className="text-white font-semibold w-fit">
                                    Puesto:
                                    <span className="font-normal text-gray-400 ml-2">{info.puesto}</span>
                                </p>
                                <p className="text-white font-semibold w-fit">
                                    Con Neoris desde:
                                    <span className="font-normal text-gray-400 ml-2">{info.fechaIngreso}</span>
                                </p>
                            </section>
                            </>
                        ) : (
                            <p>Cargando...</p>
                        )}

                        { contact ? (
                            <>
                            {/* Contacto */}
                            <section className="grid gap-2 p-2 border-b border-gray-500">
                                <Titulo title="Contacto"/>
                                <p className="text-white font-semibold w-fit">
                                    Correo electrónico:
                                    <span className="font-normal text-gray-400 ml-2">{contact.correo}</span>
                                </p>
                                <p className="text-white font-semibold w-fit">
                                    Teléfono:
                                    <span className="font-normal text-gray-400 ml-2">{contact.telefono}</span>
                                </p>
                                <div className="flex flex-row">
                                    <VerPassword password={contact.password}/>
                                    <button className="text-sm text-white font-semibold text-center p-1 rounded-full bg-[#079A74] hover:text-[#006349] hover:bg-[#42796A]">Cambiar contraseña</button>
                                </div>
                            </section>
                            </>
                        ) : ( 
                            <p>Cargando...</p>
                        )}

                        {/*} Equipo */}
                        <section className="p-2 border-b border-gray-500 mt-4 space-y-2">
                            <Titulo title="Mi Equipo"/>
                            <p className="text-gray-300 mb-2">Financiamiento PMI´s</p>
                            <div className="grid [grid-template-columns:1fr_2fr_3fr] gap-y-2">
                                {team.map((miembro, i) => (
                                    <Fragment key={i}>
                                        <p>
                                            <span className="font-semibold">Rol: </span>
                                            <span className={miembro.rol === "Administrador" ? "text-teal-400 font-semibold" : ""}>
                                              {miembro.rol}
                                            </span>
                                        </p>
                                
                                        <p>
                                          <span className="font-semibold">Nombre: </span>
                                          {miembro.nombre}
                                        </p>
                                
                                        <p>
                                          <span className="font-semibold">Correo: </span>
                                          <a href={`mailto:${miembro.correo}`} className="text-blue-400 underline">
                                            {miembro.correo}
                                          </a>
                                        </p>
                                    </Fragment>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
    );
}