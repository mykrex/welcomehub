'use client';

//* Navegation
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';
import { type ComponentType } from 'react';
import "@/app/components/(layout)/layout.css";

//* Icons/Images
import WelcomeHubLogo from './assetsLayout/WelcomeHubLogo'; //! Cambiar a WelcomeHubLogoSmall
import DashboardIcon from './assetsLayout/DashboardIcon';
import CursosIcon from './assetsLayout/CursosIcon';
import CompiIcon from './assetsLayout/CompiButtonIcon';
import RetosIcon from './assetsLayout/RetosIcon';
import NeorisIcon from './assetsLayout/NeorisIcon';
import ClockIcon from '../../(authed)/cursos/verCurso/[id]/assets/icons/ClockIcon';
//import path from 'path';

type Roles = 'administrador' | 'empleado';

interface MenuItem {
  label: string;
  icon: ComponentType<{ className?: string }>;
  path: string;
  roles?: Roles[];
}

const ALL_MENU: MenuItem[] = [
  { label: 'Dashboard', icon: DashboardIcon, path: '/dashboard', roles: ['administrador','empleado'] },
  { label: 'Cursos',    icon: CursosIcon,    path: '/cursos',    roles: ['administrador','empleado'] },
  { label: 'Compi',     icon: CompiIcon,     path: '/compi',     roles: ['administrador','empleado'] },
  { label: 'Retos',     icon: RetosIcon,     path: '/retos',     roles: ['administrador','empleado'] },
  { label: 'Neoris',    icon: NeorisIcon,    path: '/neoris',    roles: ['administrador','empleado'] },
  { label: 'Time Card', icon: ClockIcon,     path: '/timecard',  roles: ['administrador','empleado'] },
  { label: 'Mi Equipo', icon: NeorisIcon,    path: '/miequipo',  roles: ['administrador'] }, 
];

export default function SidebarMenu(){
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();

  if (!user) return null;

  // Menu items configuration
  const menuItems = ALL_MENU.filter(item =>
    item.roles?.includes(user.rol as Roles)
  );

  const getIsActive = (path: string) => {
    if (!path || !pathname) return false;
    return pathname.startsWith(path);
  };

  return (
    <div className="sidebar-container">
      <div className="logo-container">
        <WelcomeHubLogo className="logo-image" />
      </div>

      <div className="menu-list">
        {menuItems.map(({ label, icon: Icon, path }) => {
          const isActive = getIsActive(path);
          return (
            <div
              key={label}
              className={`menu-item ${isActive ? 'active' : ''}`}
              onClick={() => path && router.push(path)}
            >
              <Icon className={`icon ${isActive ? 'active-icon' : 'inactive-icon'}`} />
              <div className={`label ${isActive ? '' : 'inactive'}`}>{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};