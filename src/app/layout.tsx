// app/layout.tsx

import "./globals.css";
import { UserProvider } from "./context/UserContext";
import { ChatProvider } from "@/app/context/ChatContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
     <html lang="en" className="h-full">
      <body className="h-full">
        <UserProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </UserProvider>
      </body>
    </html>
  );
}
