"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordProps {
  password: string;
}

const VerPassword: React.FC<PasswordProps> = ({ password }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      <p className="text-white font-semibold w-fit">
        Contraseña:
        <span className="text-gray-400 font-normal ml-2">
          {showPassword ? password : "********"}
        </span>
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="text-blue-500 hover:text-blue-700 ml-2 mr-4"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </p>
    </div>
  );
};

export default VerPassword;
