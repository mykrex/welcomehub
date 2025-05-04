import "./globals.css";
import { UserProvider } from "../context/UserContext";
import { ChatProvider } from "@/context/ChatContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </UserProvider>
      </body>
    </html>
  );
}
