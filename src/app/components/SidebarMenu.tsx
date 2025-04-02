'use client';

import { useState } from 'react';
import WelcomeHubLogo from '../vercursos/icons/WelcomeHubLogo';
import DashboardIcon from '../vercursos/icons/DashboardIcon';
import CursosIcon from '../vercursos/icons/CursosIcon';
import BorisIcon from '../vercursos/icons/BorisIcon';
import RetosIcon from '../vercursos/icons/RetosIcon';
import NeorisIcon from '../vercursos/icons/NeorisIcon';

const SidebarMenu = () => {
  const [activeItem, setActiveItem] = useState('Cursos');

  const menuItems = [
    { label: 'Dashboard', icon: DashboardIcon },
    { label: 'Cursos', icon: CursosIcon },
    { label: 'Boris IA', icon: BorisIcon },
    { label: 'Retos', icon: RetosIcon },
    { label: 'Neoris', icon: NeorisIcon }
  ];

  return (
    <div className="sidebar-container">
      <div className="logo-container">
        <WelcomeHubLogo className="logo-image" />
      </div>

      <div className="menu-list">
        {menuItems.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className={`menu-item ${activeItem === label ? 'active' : ''}`}
            onClick={() => setActiveItem(label)}
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
