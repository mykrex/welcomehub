// SidebarMenu.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useUser } from "@/app/context/UserContext";
import { useUserProfile } from "@/app/hooks/useUserProfile";

import type { ComponentType } from "react";
import "./sidebarMenu.css";

import WelcomeHubLogo from "./assetsLayout/WelcomeHubLogo";
import WHLogo from "./assetsLayout/WHlogo";
import DashboardIcon from "./assetsLayout/DashboardIcon";
import CursosIcon from "./assetsLayout/CursosIcon";
import CompiIcon from "./assetsLayout/CompiButtonIcon";
import RetosIcon from "./assetsLayout/RetosIcon";
import NeorisIcon from "./assetsLayout/NeorisIcon";
import ClockIcon from "./assetsLayout/ClockIcon";
import TeamIcon from "./assetsLayout/TeamIcon";

type Roles = "administrador" | "empleado";

interface MenuItem {
  label: string;
  icon: ComponentType<{ className?: string }>;
  path: string;
  roles?: Roles[];
}

const ALL_MENU: MenuItem[] = [
  {
    label: "Dashboard",
    icon: DashboardIcon,
    path: "/dashboard",
    roles: ["administrador", "empleado"],
  },
  {
    label: "Cursos",
    icon: CursosIcon,
    path: "/cursos",
    roles: ["administrador", "empleado"],
  },
  {
    label: "Compi",
    icon: CompiIcon,
    path: "/compi",
    roles: ["administrador", "empleado"],
  },
  {
    label: "Time Card",
    icon: ClockIcon,
    path: "/timecard",
    roles: ["administrador", "empleado"],
  },
  {
    label: "Mi Equipo",
    icon: TeamIcon,
    path: "/mi_equipo",
    roles: ["administrador"],
  },
  {
    label: "Retos",
    icon: RetosIcon,
    path: "/retos",
    roles: ["administrador", "empleado"],
  },
  {
    label: "Neoris",
    icon: NeorisIcon,
    path: "/neoris",
    roles: ["administrador", "empleado"],
  },
];

export default function SidebarMenu() {
  // ───────────────────────────────────────────────
  // 1) Siempre invocar TODOS los Hooks al inicio, SIN CONDICIONALES
  // ───────────────────────────────────────────────
  const router = useRouter();
  const pathname = usePathname();

  // Hook de sesión (puede estar en “loading” o ya traer el `user` o traer `null`).
  const { user, loadingUser } = useUser();

  // Obtenemos perfil (nombres, apellidos, email, etc). Puede estar “loadingProfile” aun.
  const { profile, loading: loadingProfile } = useUserProfile();

  // Hooks para cargar avatar (siempre van antes de cualquier return)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fetchAvatar = useCallback(async () => {
    try {
      const resp = await fetch("/api/avatar/bajarAvatar");
      if (!resp.ok) {
        setAvatarUrl(null);
        return;
      }
      const { url } = await resp.json();
      const separador = url.includes("?") ? "&" : "?";
      setAvatarUrl(`${url}${separador}v=${Date.now()}`);
    } catch {
      setAvatarUrl(null);
    }
  }, []);

  useEffect(() => {
    // Sólo cuando YA tenemos “user” (no importa si loadingProfile) y “profile” definido,
    // pedimos el avatar.
    if (user && profile) {
      fetchAvatar();
    }
  }, [fetchAvatar, user, profile]);

  // ───────────────────────────────────────────────
  // 2) Control de “SESIÓN NO EXISTE” sólo cuando sabemos que YA no se está cargando y user===null
  // ───────────────────────────────────────────────
  // OJO: NO quitamos el sidebar cuando modelUser está en true (loading).
  // Sólo cuando loadingUser===false y user===null, podemos inferir que NO hay sesión.
  if (!loadingUser && !user) {
    // Aquí podrías redirigir a /login si lo deseas, o mostrar nulo:
    return null;
  }

  // ───────────────────────────────────────────────
  // 3) A partir de aquí “loadingUser===true” (todavía verificando)
  //    ó “user” existe (sesión válida).
  //    Dejamos que el SidebarSIEMPRE se renderice, para que no desaparezca.
  // ───────────────────────────────────────────────

  // Si “user” ya está definido, filtramos el menú según su rol.
  // Si “user” todavía no llegó (loadingUser===true), menuItems será [].
  const menuItems: MenuItem[] = user
    ? ALL_MENU.filter((item) => item.roles?.includes(user.rol as Roles))
    : [];

  const getIsActive = (path: string) => pathname?.startsWith(path);
  const isProfileActive = pathname === "/mi_perfil";

  // Preparamos los valores para el perfil:
  // – Si loadingProfile===true (perfil aún no llegó), mostramos “…” como placeholder.
  // – En cuanto loadingProfile===false y profile existe, concatenamos nombres/ apellidos reales.
  const firstName = loadingProfile
    ? "…"
    : profile?.nombres?.split(" ")[0] || "Usuario";
  const firstLastName = loadingProfile
    ? ""
    : profile?.apellidos?.split(" ")[0] || "";
  const displayName = `${firstName} ${firstLastName}`.trim();

  // Para el email, igual:
  const emailParts = loadingProfile
    ? ["cargando", ""]
    : profile?.email?.split("@") || ["", ""];
  const emailUsername = emailParts[0];
  const emailDomain = emailParts[1] ? `@${emailParts[1]}` : "";

  // ───────────────────────────────────────────────
  // 4) Render FINAL: El DIV “sidebar-container” SIEMPRE se muestra (no importa loadingUser),
  //    de modo que no desaparezca al cambiar de pantalla.
  // ───────────────────────────────────────────────
  return (
    <div className="sidebar-container group">
      {/* ─── Logo en la parte superior ─── */}
      <div className="logo-container">
        {/* 1) Logo compacto (aparece cuando NO hay hover) */}
        <div className="logo-compact">
          <WHLogo className="logo-image" />
        </div>
        {/* 2) Logo completo (aparece cuando HAY hover) */}
        <div className="logo-full">
          <WelcomeHubLogo className="logo-image" />
        </div>
      </div>

      {/* ─── Lista de ítems del menú ─── */}
      <div className="menu-list">
        {menuItems.map(({ label, icon: Icon, path }) => {
          const isActive = getIsActive(path);
          return (
            <div
              key={label}
              className={`menu-item ${isActive ? "active" : ""}`}
              onClick={async () => {
                if (label === "Neoris") {
                  await fetch("/api/retos/verificarLeeHistoria", {
                    method: "POST",
                    credentials: "include",
                  });
                }
                router.push(path);
              }}
            >
              <div
                className={`icon-wrapper ${
                  isActive ? "active-icon-wrapper" : ""
                }`}
              >
                <Icon
                  className={`icon ${
                    isActive ? "active-icon" : "inactive-icon"
                  }`}
                />
              </div>
              <div
                className={`label group-hover:opacity-100 opacity-0 transition-opacity duration-300 ${
                  isActive ? "active-button" : "inactive-button"
                }`}
              >
                {label}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Botón de perfil (siempre presente la foto, texto oculto hasta hover) ─── */}
      <Link
        href="/mi_perfil"
        className={`profile-container ${
          isProfileActive ? "active-profile" : ""
        }`}
      >
        {/* 1) Siempre mostramos la foto */}
        <Image
          unoptimized
          src={avatarUrl || "/placeholder_profile.png"}
          alt="Avatar"
          width={45}
          height={45}
          className="profile-pic"
        />

        {/* 2) Este span arranca con opacity:0 y sólo al hacer hover en el contenedor 
               (.group:hover) pasará a opacity:1 (ver CSS). */}
        <span className="profile-text">
          <div className="profile-name">{displayName}</div>
          <div
            className="profile-email"
            title={loadingProfile ? "" : profile?.email}
          >
            <span className="email-username">{emailUsername}</span>
            <span className="email-domain">{emailDomain}</span>
          </div>
        </span>
      </Link>
    </div>
  );
}
