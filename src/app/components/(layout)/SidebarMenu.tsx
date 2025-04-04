'use client';

//* Navegation
import { usePathname, useRouter } from 'next/navigation';
import "@/app/components/(layout)/layout.css";

//* Icons/Images
import WelcomeHubLogo from '../../verCursos/icons/WelcomeHubLogo'; //! Cambiar a WelcomeHubLogoSmall
import DashboardIcon from '../../verCursos/icons/DashboardIcon';
import CursosIcon from '../../verCursos/icons/CursosIcon';
import BorisIcon from '../../verCursos/icons/BorisIcon';
import RetosIcon from '../../verCursos/icons/RetosIcon';
import NeorisIcon from '../../verCursos/icons/NeorisIcon';
import path from 'path';

const SidebarMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  //* Menu items configuration
  const menuItems = [
    { label: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
    { label: 'Cursos', icon: CursosIcon, path: '/cursos' },
    { label: 'Boris IA', icon: BorisIcon, path: '/compi' }, //! CAMBIAR TODO A COMPI, NO BORIS
    { label: 'Retos', icon: RetosIcon, path: '/retos' },
    { label: 'Neoris', icon: NeorisIcon, path: '/neoris' }, 
  ];

  const getIsActive = (path?: string) => {
    if (!path) return false;
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

export default SidebarMenu;
