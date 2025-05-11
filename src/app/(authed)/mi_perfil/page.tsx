'use client'

import { useState, useEffect, Fragment } from "react";
import { useUser } from "../../context/UserContext";
import { useRouter } from "next/navigation"
import FotoPerfil from "../../components/fotoPerfil";
import Titulo from "../../components/perfilTitulos";

interface Info {
     id_usuario: string;
     nombre: string;
     apellido: string;
     fechaNacimiento: string;
     puesto: string;
     fechaIngreso: string;
}

interface Contact {
     correo: string;
     telefono: string;
}

interface TeamMember {
     puesto: string;
     nombre: string;
     correo: string;
     isAdmin: boolean;
}

interface RawMiembro {
     nombres: string;
     apellidos: string;
     email: string;
     puesto: string;
}
  

/*const getUserProfile = async () => {
    //const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData?.session?.access_token) {
      console.error("No se pudo obtener el token de sesión", sessionError);
      throw new Error("No se pudo obtener el token de sesión");
    }
  
    const token = sessionData.session.access_token;
    console.log("🔐 Token obtenido:", token);
  
    const response = await fetch("/api/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    const result = await response.json();
    console.log("Respuesta de /api/users/me:", result);
  
    if (!response.ok) {
      console.error("Error desde /api/users/me:", result.error);
      throw new Error(result.error || "Error al obtener perfil");
    }
  
    return result.perfil;
};*/

const getUserProfile = async () => {
    const response = await fetch("/api/users/me", {
      method: "GET",
      credentials: "include", // Necesario para enviar cookies HttpOnly
    });
  
    const result = await response.json();
    console.log("Respuesta de /api/users/me:", result);
  
    if (!response.ok) {
      console.error("Error desde /api/users/me:", result.error);
      throw new Error(result.error || "Error al obtener perfil");
    }
  
    return result;
};

const getTeam = async () => {
    const response = await fetch("/api/team/info", {
        credentials: "include", //se envíe la cookie
    });
  
    const result = await response.json();
  
    if (!response.ok) {
      throw new Error(result.error || "Error al obtener equipo");
    }
  
    return result;
};
  
export default function MiPerfil() {
    const [info, setInfo] = useState<Info | null>(null);
    const [contact, setContact] = useState<Contact | null>(null);
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [teamName, setTeamName] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const { user, setUser } = useUser();
    const router = useRouter();

    // Get data when the components is loading
    useEffect(() => {
        if (!user?.email) return;
        
        const fetchData = async () => {
            try {
                setLoading(true);

                const perfil = await getUserProfile();

                console.log("Perfil:", perfil);

                setInfo({
                     id_usuario: perfil.id_usuario,
                     nombre: perfil.nombres,
                     apellido: perfil.apellidos,
                     fechaNacimiento: perfil.fecha_nacimiento,
                     puesto: perfil.puesto,
                     fechaIngreso: perfil.en_neoris_desde,
                });
            
                setContact({
                     correo: perfil.email,
                     telefono: perfil.telefono
                });

                const teamData = await getTeam();

                console.log("Miembros del equipo:", teamData.miembros);

                setTeamName(teamData.equipo);
                            
                setTeam(
                  teamData.miembros
                    .map((m: RawMiembro) => ({
                         nombre: `${m.nombres} ${m.apellidos}`,
                         correo: m.email,
                         puesto: m.puesto,
                         isAdmin: m.email === teamData.administrador,
                    }))
                    .sort((a: TeamMember, b: TeamMember) => (a.isAdmin ? -1 : b.isAdmin ? 1 : 0))
                );

            } catch(error) {
                console.log("Error obteniendo los datos: ", error);
            } finally {
                setLoading(false)
            }
        };
        fetchData();
    }, [user]);

    const handleChangePassword = () => {
        router.push("/olvide_contrasena");
    };

    if (loading) {
        return (
          <div className="flex items-center justify-center h-screen text-white">
            <p className="text-lg animate-pulse">Cargando perfil...</p>
          </div>
        );
      }
      
    return (
        <div className="flex-1 overflow-auto">
            <main className="container mx-auto px-4 py-6">
                <h1 className="text-white text-semibold text-2xl mb-6">Mi perfil</h1>
                <div className="bg-[#141414] rounded-xl p-6 text-white">
                    {/** Basic Info */}
                    <section className="flex flex-row gap-6 border-b border-gray-500 pb-4">
                        <div className="flex-1 space-y-2">
                            <Titulo title="Información Básica"/>
                            <p className="text-white font-semibold w-fit">
                                Nombre(s): <span className="font-normal text-gray-400 ml-2">{info?.nombre}</span>
                            </p>
                            <p className="text-white font-semibold w-fit">
                                Apellido(s): <span className="font-normal text-gray-400 ml-2">{info?.apellido}</span>
                            </p>
                            <p className="text-white font-semibold w-fit">
                                Fecha de Nacimiento: <span className="font-normal text-gray-400 ml-2">{info?.fechaNacimiento}</span>
                            </p>
                            <p className="text-white font-semibold w-fit">
                                Puesto: <span className="font-normal text-gray-400 ml-2">{info?.puesto}</span>
                            </p>
                            <p className="text-white font-semibold w-fit">
                                Con Neoris desde: <span className="font-normal text-gray-400 ml-2">{info?.fechaIngreso}</span>
                            </p>
                        </div>
                        <div className="relative w-[180px] h-[180px]">
                             {user?.id_usuario && <FotoPerfil userId={user.id_usuario} />}
                        </div>
                    </section>
                        
                    {/** Contact */}
                    <section className="grid gap-2 p-2 border-b border-gray-500">
                        <Titulo title="Contacto"/>
                        <p className="text-white font-semibold w-fit">
                            Correo electrónico: <span className="font-normal text-gray-400 ml-2">{contact?.correo}</span>
                        </p>
                        <p className="text-white font-semibold w-fit">
                            Teléfono: <span className="font-normal text-gray-400 ml-2">{contact?.telefono}</span>
                        </p>
                        <div className="flex flex-row">
                            {/**<VerPassword password={contact?.password}/>  Esta  funcion se debe quitar por seguridad*/}
                            <button onClick={handleChangePassword} className="text-sm text-white font-semibold text-center p-1 rounded-full bg-cyan-600 hover:bg-cyan-700">Cambiar contraseña</button>
                        </div>
                    </section>

                    {/** Team */}
                    <section className="p-2 border-b border-gray-500 mt-4 space-y-2">
                        <Titulo title="Mi Equipo"/>
                        <p className="text-gray-300 mb-2">{teamName || "Equipo sin nombre"}</p>
                        <div className="grid [grid-template-columns:1fr_2fr_3fr] gap-y-2">
                            {team.map((miembro, i) => (
                                <Fragment key={i}>
                                    <p>
                                        <span className="font-semibold">Puesto: </span>
                                        <span className={miembro.isAdmin ? "text-teal-400 font-semibold" : "text-gray-400 font-normal"}>
                                            {miembro.puesto}
                                        </span>
                                    </p>
                                    
                                    <p>
                                      <span className="font-semibold">Nombre: </span>
                                      <span className="text-gray-400 font-normal">{miembro.nombre}</span>
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

                    <section className="flex justify-center">
                    <button
                    onClick={async () => {
                        try {
                          await fetch('/api/auth/logout', {
                            method: 'POST', // puedes dejarlo GET si así lo configuraste, pero POST es más limpio
                            credentials: 'include',
                          });
                    
                          setUser(null);
                          router.push('/login'); // o donde quieras llevar al usuario tras cerrar sesión
                        } catch (error) {
                          console.error('Error al cerrar sesión:', error);
                        }
                    }}
                    className="mt-8 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
                    >
                        Cerrar sesión
                    </button>

                    </section>
                </div>
            </main>
        </div>
    );
}