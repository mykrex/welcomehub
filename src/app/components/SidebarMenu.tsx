'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WelcomeHubLogo from '../verCursos/icons/WelcomeHubLogo';
import DashboardIcon from '../verCursos/icons/DashboardIcon';
import CursosIcon from '../verCursos/icons/CursosIcon';
import BorisIcon from '../verCursos/icons/BorisIcon';
import RetosIcon from '../verCursos/icons/RetosIcon';
import NeorisIcon from '../verCursos/icons/NeorisIcon';

const SidebarMenu = () => {
  const [activeItem, setActiveItem] = useState('Cursos');
  const router = useRouter();

  const menuItems = [
    { label: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
    { label: 'Cursos', icon: CursosIcon, path: '/cursos' },
    { label: 'Boris IA', icon: BorisIcon },
    { label: 'Retos', icon: RetosIcon },
    { label: 'Neoris', icon: NeorisIcon }
  ];

  const handleClick = (label: string, path?: string) => {
    setActiveItem(label);
    if (path) router.push(path);
  };

  return (
    <div className="sidebar-container">
      <div className="logo-container">
        <WelcomeHubLogo className="logo-image" />
      </div>

      <div className="menu-list">
        {menuItems.map(({ label, icon: Icon, path }) => (
          <div
            key={label}
            className={`menu-item ${activeItem === label ? 'active' : ''}`}
            onClick={() => handleClick(label, path)}
          >
            <Icon className={`icon ${activeItem === label ? 'active-icon' : 'inactive-icon'}`} />
            <div className={`label ${activeItem === label ? '' : 'inactive'}`}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarMenu;
