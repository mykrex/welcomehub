"use client";

import { useUser } from "../../context/UserContext";
import SidebarMenu from "./SidebarMenu";
import "@/app/components/(layout)/layout.css";

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="app-container">
      <SidebarMenu />
      <div className="page-wrapper">
        <div className="main-content">{children}</div>
      </div>
    </div>
  );
};

export default AppWrapper;
