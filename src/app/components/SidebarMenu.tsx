'use client';

import { usePathname, useRouter } from 'next/navigation';
import WelcomeHubLogo from '../verCursos/icons/WelcomeHubLogo';
import DashboardIcon from '../verCursos/icons/DashboardIcon';
import CursosIcon from '../verCursos/icons/CursosIcon';
import BorisIcon from '../verCursos/icons/BorisIcon';
import RetosIcon from '../verCursos/icons/RetosIcon';
import NeorisIcon from '../verCursos/icons/NeorisIcon';

const SidebarMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
    { label: 'Cursos', icon: CursosIcon, path: '/cursos' },
    { label: 'Boris IA', icon: BorisIcon },
    { label: 'Retos', icon: RetosIcon },
    { label: 'Neoris', icon: NeorisIcon },
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
