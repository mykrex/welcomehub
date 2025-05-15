'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import "@/app/components/(layout)/layout.css";

import SearchIcon from './assetsLayout/SearchIcon';
import SettingsIcon from './assetsLayout/SettingsIcon';
import NotificationIcon from './assetsLayout/NotificationIcon';
import profilePicture from "./assetsLayout/profilePicture.png"; // adjust path if needed

const pathToTitleMap: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/cursos': 'Mis Cursos',
  '/mi_perfil': 'Mi Perfil',
  '/verCursos': 'Atención a Clientes y Ventas',
  '/retos': 'Mis Retos',
  '/compi': 'Compi',
  '/timecard': 'Timecard',
  '/miequipo': 'Mi Equipo'
};

const Navbar = () => {
  const pathname = usePathname();
  const title = pathname ? pathToTitleMap[pathname] || 'WelcomeHub' : 'WelcomeHub';

  return (
    <div className="navbar">
      {/* Left */}
      <div className="navbar-title">
        <div className="navbar-title-main">{title}</div>
      </div>

      {/* Right */}
      <div className="navbar-right">
        <div className="navbar-status-bar">
          <SearchIcon className="icon-placeholder" />
        </div>

        <div className="navbar-icons">
          <SettingsIcon className="icon-placeholder" />
          <NotificationIcon className="icon-placeholder" />
          <Link href="/mi_perfil">
            <Image
              src={profilePicture.src}
              alt="Profile"
              className="profile-pic"
              width={30}
              height={30}
              style={{ borderRadius: '50%', cursor: 'pointer' }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
