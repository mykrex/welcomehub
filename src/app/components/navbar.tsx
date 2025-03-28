import React from 'react';
import { Search, Bell } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="flex justify-center items-center w-[1438px] min-w-[1438px] p-[10px_15px] gap-2 rounded-2xl bg-[#141414]">
      {/* Search Bar */}
      <div className="flex items-center w-[1100px] h-[35px] p-2 gap-2 rounded-lg bg-[#333]">
        <Search className="text-[#8A8A8A]" width={24.073} height={24.073} />
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full bg-transparent border-none text-[#8A8A8A] text-[20px] font-normal placeholder-[#8A8A8A] focus:outline-none"
        />
      </div>

      {/* Bell Icon */}
      <div className="flex justify-center items-center">
        <Bell width={27} height={30} className="text-[#8A8A8A]" />
      </div>

      {/* Profile Icon */}
      <div
        className="w-[50px] h-[50px] rounded-full bg-cover bg-center bg-lightgray"
        style={{
          backgroundImage: "url('<path-to-image>')",
        }}
      ></div>
    </div>
  );
};

export default Navbar;
