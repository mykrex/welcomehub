import SidebarMenu from "@/app/components/(layout)/SidebarMenu";
import "./layout.css";
import Chatbot from "@/app/components/(compi)/chatbot";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-container">
      <Chatbot />
      <SidebarMenu />
      <div className="page-wrapper">
        <div className="main-content">{children}</div>
      </div>
    </div>
  );
}
