"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useUser } from "@/app/context/UserContext";
import { useUserProfile } from "@/app/hooks/useUserProfile";

import type { ComponentType } from "react";
import "./sidebarMenu.css";

import WelcomeHubLogo from "../(icons)/WelcomeHubLogo";
import WHLogo from "../(icons)/WHlogo";
import DashboardIcon from "../(icons)/Dashboard";
import CursosIcon from "../(icons)/Book";
import CompiIcon from "../(icons)/Message";
import RetosIcon from "../(icons)/StarRetos";
import NeorisIcon from "../(icons)/Information";
import ClockIcon from "../(icons)/Clock";
import TeamIcon from "../(icons)/Team";

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
  const router = useRouter();
  const pathname = usePathname();

  const { user, loadingUser } = useUser();

  const { profile, loading: loadingProfile } = useUserProfile();

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
    if (user && profile) {
      fetchAvatar();
    }
  }, [fetchAvatar, user, profile]);

  if (!loadingUser && !user) {
    return null;
  }

  const menuItems: MenuItem[] = user
    ? ALL_MENU.filter((item) => item.roles?.includes(user.rol as Roles))
    : [];

  const getIsActive = (path: string) => pathname?.startsWith(path);
  const isProfileActive = pathname === "/mi_perfil";

  const firstName = loadingProfile
    ? "…"
    : profile?.nombres?.split(" ")[0] || "Usuario";
  const firstLastName = loadingProfile
    ? ""
    : profile?.apellidos?.split(" ")[0] || "";
  const displayName = `${firstName} ${firstLastName}`.trim();

  const emailParts = loadingProfile
    ? ["cargando", ""]
    : profile?.email?.split("@") || ["", ""];
  const emailUsername = emailParts[0];
  const emailDomain = emailParts[1] ? `@${emailParts[1]}` : "";

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
