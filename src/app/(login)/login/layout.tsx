import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WelcomeHub",
  description: "Generado por el equipo de WelcomeHub",
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
