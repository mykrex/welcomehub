import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Chatbot from "../app/components/chatbot";
import { ChatProvider } from "@/app/context/ChatContext";
import { UserProvider } from "@/app/context/UserContext"; 

function renderWithContext() {
  return render(
    <UserProvider>
      <ChatProvider>
        <Chatbot />
      </ChatProvider>
    </UserProvider>
  );
}

describe("Chatbot Component", () => {
  test("Renderiza el botón del chatbot", () => {
    renderWithContext();
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  test("Muestra ventana del chat al hacer clic en el botón", () => {
    renderWithContext();
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByText("Compi")).toBeInTheDocument();
  });

  test("Renderiza el textarea al abrir el chat", () => {
    renderWithContext();
    fireEvent.click(screen.getByRole("button"));
    const textarea = screen.getByPlaceholderText("Hola, ¿cómo puedo ayudarte?");
    expect(textarea).toBeInTheDocument();
  });

  test("Permite escribir en el textarea", () => {
    renderWithContext();
    fireEvent.click(screen.getByRole("button"));
    const textarea = screen.getByPlaceholderText("Hola, ¿cómo puedo ayudarte?");
    fireEvent.change(textarea, { target: { value: "¿Cuál es el código de vestimenta?" } });
    expect(textarea).toHaveValue("¿Cuál es el código de vestimenta?");
  });

  test("Cierra la ventana del chat al volver a hacer clic en el botón", () => {
    renderWithContext();
    const button = screen.getByRole("button");
    fireEvent.click(button); // abrir
    fireEvent.click(button); // cerrar
    expect(screen.queryByText("Compi")).not.toBeInTheDocument();
  });
});
