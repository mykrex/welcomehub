import type { Metadata } from "next";
import { UserProvider } from "../context/UserContext";
import Chatbot from "../components/chatbot";

export const metadata: Metadata = {
  title: "Welcome Hub",
  description: "Generado por el equipo de Welcome Hub",
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
  return (
    <UserProvider>
      {children} 
    </UserProvider>
  );
}
