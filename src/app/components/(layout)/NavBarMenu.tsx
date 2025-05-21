'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import "@/app/components/(layout)/layout.css";

import SearchIcon from './assetsLayout/SearchIcon';
import SettingsIcon from './assetsLayout/SettingsIcon';
import NotificationIcon from './assetsLayout/NotificationIcon';

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

export default function Navbar() {
  const pathname = usePathname();
  const title = pathname ? pathToTitleMap[pathname] || 'WelcomeHub' : 'WelcomeHub';

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fetchAvatar = useCallback(async () => {
    try {
      const resp = await fetch('/api/avatar/bajarAvatar');
      if (!resp.ok) {
        setAvatarUrl(null);
        return;
      }
      const { url } = await resp.json();
      const separator = url.includes('?') ? '&' : '?';
      setAvatarUrl(`${url}${separator}v=${Date.now()}`);
    } catch {
      setAvatarUrl(null);
    }
  }, []);

  useEffect(() => {
    fetchAvatar();
  }, [fetchAvatar]);

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
              unoptimized
              src={avatarUrl || '/placeholder_profile.png'}
              alt="Avatar"
              width={30}
              height={30}
              className="profile-pic"
              style={{ borderRadius: '50%', cursor: 'pointer' }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};