import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "@/app/login/page"; 
import { UserProvider } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";

// Mock del router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  mockPush.mockReset();
});

function renderLogin() {
  return render(
    <UserProvider>
      <LoginPage />
    </UserProvider>
  );
}

describe("HU-01: Inicio de sesión", () => {
  test("1. Muestra error si el correo no es del dominio neoris.mx", async () => {
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("usuario@neoris.mx"), {
      target: { value: "usuario@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("contraseña"), {
      target: { value: "Contrasena1!" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /ingresar/i }));

    expect(await screen.findByText("Correo o contraseña inválidos")).toBeInTheDocument();
  });

  test("2. Muestra error si la contraseña no tiene el formato correcto", async () => {
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("usuario@neoris.mx"), {
      target: { value: "usuario@neoris.mx" },
    });
    fireEvent.change(screen.getByPlaceholderText("contraseña"), {
      target: { value: "simple" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /ingresar/i }));

    expect(await screen.findByText("Correo o contraseña inválidos")).toBeInTheDocument();
  });

  test("3. Muestra error si las credenciales son inválidas en el servidor", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Credenciales inválidas" }),
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("usuario@neoris.mx"), {
      target: { value: "usuario@neoris.mx" },
    });
    fireEvent.change(screen.getByPlaceholderText("contraseña"), {
      target: { value: "Contrasena1!" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /ingresar/i }));

    expect(await screen.findByText("Credenciales inválidas")).toBeInTheDocument();
  });

  test("4. Redirige al dashboard si el login es exitoso", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { email: "usuario@neoris.mx" } }),
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("usuario@neoris.mx"), {
      target: { value: "usuario@neoris.mx" },
    });
    fireEvent.change(screen.getByPlaceholderText("contraseña"), {
      target: { value: "Contrasena1!" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /ingresar/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("5. No permite enviar el formulario si los campos están vacíos", async () => {
    global.fetch = jest.fn(); // asegura que no se llame
  
    renderLogin();
  
    fireEvent.submit(screen.getByRole("button", { name: /ingresar/i }));
  
    expect(await screen.findByText("Correo o contraseña inválidos")).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("6. El enlace '¿Olvidaste tu contraseña?' apunta a /olvide_contrasena", () => {
    renderLogin();
    const link = screen.getByText("¿Olvidaste tu contraseña?");
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe("/olvide_contrasena");
  });

  
  test("7. El botón de ingresar está presente y funcional", () => {
    renderLogin();
    const button = screen.getByRole("button", { name: /ingresar/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Ingresar");
  });
  
});
