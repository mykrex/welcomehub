import { Bot, User } from "lucide-react";

interface AvatarProps {
  sender: "user" | "bot";
  className?: string;
}

export function Avatar({ sender, className }: AvatarProps) {
  return (
    <div className={`rounded-[10px] flex items-center justify-center ${className}`}>
      {sender === "user" ? (
        <User className="w-5 h-5 text-white bg-[#06D6A0] rounded-[10px]" />
      ) : (
        <Bot className="w-5 h-5 text-white bg-[#448AFF] rounded-[10px]" />
      )}
    </div>
  );
}
