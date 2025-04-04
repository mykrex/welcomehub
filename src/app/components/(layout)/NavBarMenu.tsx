'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import "@/app/components/(layout)/layout.css";

import SearchIcon from '../../verCursos/icons/SearchIcon';
import SettingsIcon from '../../verCursos/icons/SettingsIcon';
import NotificationIcon from '../../verCursos/icons/NotificationIcon';
import profilePicture from "@/app/verCursos/profilePicture.png"; // adjust path if needed

const pathToTitleMap: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/cursos': 'Mis Cursos',
  '/mi-perfil': 'Mi Perfil',
  '/verCursos': 'Atención a Clientes y Ventas',
};

const Navbar = () => {
  const pathname = usePathname();
  const title = pathToTitleMap[pathname] || 'WelcomeHub';

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
          <Link href="/mi-perfil">
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
