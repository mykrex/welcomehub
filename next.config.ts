import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '54321',
        pathname: '/storage/**',
      },
    ],
  },
  /* El middleware se aplica a estas rutas protegidas
  matcher: [
    '/mi_perfil',
    '/dashboard',
    '/api/users/me',
    '/api/team/info',
  ],*/
};

export default nextConfig;

export const config = {
  matcher: ['/((?!_next|favicon|public|.*\\.png$).*)'],
};