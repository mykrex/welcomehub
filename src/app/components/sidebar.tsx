import React from "react";
import { Card } from "@/components/ui/card";

const Sidebar = () => {
  return (
    <Card className="w-72 h-screen flex flex-col items-center gap-6 p-6 bg-[#141414] rounded-2xl">
      {/* Logo */}
      <div className="text-[#F3F2F2] font-bold text-3xl">welcomeHub</div>

      {/* Dashboard Button */}
      <div className="w-full">
        <button className="w-full h-16 flex items-center gap-4 px-6 rounded-xl bg-gradient-to-r from-[#448AFF] to-[#1565C0] shadow-md backdrop-blur-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"s
            height="24"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M1.11111 11.1111H7.77778C8.39111 11.1111 8.88889 10.6144 8.88889 10V1.11111C8.88889 0.496667 8.39111 0 7.77778 0H1.11111C0.497778 0 0 0.496667 0 1.11111V10C0 10.6144 0.497778 11.1111 1.11111 11.1111ZM0 18.8889C0 19.5033 0.497778 20 1.11111 20H7.77778C8.39111 20 8.88889 19.5033 8.88889 18.8889V14.4444C8.88889 13.83 8.39111 13.3333 7.77778 13.3333H1.11111C0.497778 13.3333 0 13.83 0 14.4444V18.8889ZM11.1111 18.8889C11.1111 19.5033 11.6078 20 12.2222 20H18.8889C19.5033 20 20 19.5033 20 18.8889V11.1111C20 10.4967 19.5033 10 18.8889 10H12.2222C11.6078 10 11.1111 10.4967 11.1111 11.1111V18.8889ZM12.2222 7.77778H18.8889C19.5033 7.77778 20 7.28111 20 6.66667V1.11111C20 0.496667 19.5033 0 18.8889 0H12.2222C11.6078 0 11.1111 0.496667 11.1111 1.11111V6.66667C11.1111 7.28111 11.6078 7.77778 12.2222 7.77778Z"
              fill="#F3F2F2"
            />
          </svg>
          <span className="text-white font-medium text-lg">Dashboard</span>
        </button>
      </div>

      {/* Cursos Buttonssssss */}
      <div className="w-full flex items-center gap-4 px-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 20 24"
          fill="none"
        >
          <path
            d="M2.85714 0.571533C2.65714 0.571533 2.48571 0.600105 2.31429 0.657247C1.2 0.885819 0.314286 1.77153 0.0857143 2.88582C0 3.05725 0 3.22868 0 3.42868V19.143C0 21.5144 1.91429 23.4287 4.28571 23.4287H20V20.5715H4.28571C3.48571 20.5715 2.85714 19.943 2.85714 19.143C2.85714 18.343 3.48571 17.7144 4.28571 17.7144H20V2.0001C20 1.2001 19.3714 0.571533 18.5714 0.571533H17.1429V9.14296L14.2857 6.28582L11.4286 9.14296V0.571533H2.85714Z"
            fill="#999999"
          />
        </svg>
        <span className="text-gray-400 font-medium text-lg">Cursos</span>
      </div>

      {/* NeoBot Button */}
      <div className="w-full flex items-center gap-4 px-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#999999"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-2M7 8H5a2 2 0 00-2 2v8a2 2 0 002 2h2m10-6H7m10-4V6a4 4 0 10-8 0v4m8 0H7"
          />
        </svg>
        <span className="text-gray-400 font-medium text-lg">NeoBot</span>
      </div>
    </Card>
  );
};

export default Sidebar;
