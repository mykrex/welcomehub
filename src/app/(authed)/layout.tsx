import SidebarMenu from "@/app/components/(layout)/SidebarMenu";
import NavBarMenu from "@/app/components/(layout)/NavBarMenu";
import "@/app/components/(layout)/layout.css";
import Chatbot from "@/app/components/chatbot";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-container">
      <Chatbot />
      <SidebarMenu />
      <div className="page-wrapper">
        <NavBarMenu />
        <div className="main-content">{children}</div>
      </div>
    </div>
  );
}
