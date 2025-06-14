import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "@/app/(login)/login/page";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/components/(icons)/WelcomeHubLogo", () => {
  return function MockWelcomeHubLogo({ className }: { className?: string }) {
    return (
      <div data-testid="welcome-hub-logo" className={className}>
        WelcomeHub Logo
      </div>
    );
  };
});

jest.mock("next/link", () => {
  return function Link({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

const mockPush = jest.fn();
const mockSetUser = jest.fn();

jest.mock("@/app/context/UserContext", () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useUser: () => ({
    setUser: mockSetUser,
    user: null,
  }),
}));

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  mockPush.mockReset();
  mockSetUser.mockReset();

  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

function renderLogin() {
  return render(<LoginPage />);
}

describe("HU-01: User Login", () => {
  test("1. Renders login form correctly", () => {
    renderLogin();

    expect(screen.getByTestId("welcome-hub-logo")).toBeInTheDocument();
    expect(screen.getByText("Inicia sesión")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("usuario@neoris.mx")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("contraseña")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /ingresar/i })
    ).toBeInTheDocument();
  });

  test("2. Shows error if email is not from neoris.mx domain", async () => {
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("usuario@neoris.mx"), {
      target: { value: "usuario@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("contraseña"), {
      target: { value: "Contrasena1!" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /ingresar/i }));

    expect(
      await screen.findByText("Correo o contraseña inválidos")
    ).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("3. Shows error if password doesn't have correct format", async () => {
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("usuario@neoris.mx"), {
      target: { value: "usuario@neoris.mx" },
    });
    fireEvent.change(screen.getByPlaceholderText("contraseña"), {
      target: { value: "simple" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /ingresar/i }));

    expect(
      await screen.findByText("Correo o contraseña inválidos")
    ).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("4. Shows error if credentials are invalid on server", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
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

    expect(
      await screen.findByText("Credenciales inválidas")
    ).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledWith("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "usuario@neoris.mx",
        password: "Contrasena1!",
      }),
    });
  });

  test("5. Redirects to dashboard and sets user if login is successful", async () => {
    const mockUser = {
      email: "usuario@neoris.mx",
      id: "123",
      name: "Usuario Test",
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: mockUser,
        access_token: "fake-access-token",
        refresh_token: "fake-refresh-token",
      }),
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
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "usuario@neoris.mx",
        password: "Contrasena1!",
      }),
    });
  });

  test("6. Doesn't allow form submission if fields are empty", () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText("usuario@neoris.mx");
    const passwordInput = screen.getByPlaceholderText("contraseña");

    expect(emailInput).toHaveAttribute("required");
    expect(passwordInput).toHaveAttribute("required");
  });

  test("7. 'Forgot password?' link points to /olvide_contrasena", () => {
    renderLogin();

    const link = screen.getByText("¿Olvidaste tu contraseña?");
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe("/olvide_contrasena");
    expect(link).toHaveClass(
      "text-blue-500",
      "hover:text-blue-600",
      "underline"
    );
  });

  test("8. Login button is present and has correct styles", () => {
    renderLogin();

    const button = screen.getByRole("button", { name: /ingresar/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Ingresar");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveClass(
      "w-full",
      "bg-gradient-to-r",
      "from-blue-400",
      "to-blue-600"
    );
  });

  test("9. Handles network errors correctly", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("usuario@neoris.mx"), {
      target: { value: "usuario@neoris.mx" },
    });
    fireEvent.change(screen.getByPlaceholderText("contraseña"), {
      target: { value: "Contrasena1!" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /ingresar/i }));

    expect(await screen.findByText("Network error")).toBeInTheDocument();
  });

  test("10. Handles errors without specific message", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("usuario@neoris.mx"), {
      target: { value: "usuario@neoris.mx" },
    });
    fireEvent.change(screen.getByPlaceholderText("contraseña"), {
      target: { value: "Contrasena1!" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /ingresar/i }));

    expect(
      await screen.findByText("Error al iniciar sesión")
    ).toBeInTheDocument();
  });

  test("11. Input fields have correct attributes", () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText("usuario@neoris.mx");
    const passwordInput = screen.getByPlaceholderText("contraseña");

    expect(emailInput).toHaveAttribute("type", "email");
    expect(passwordInput).toHaveAttribute("type", "password");

    expect(emailInput).toHaveClass("w-full", "p-2", "bg-gray-700");
    expect(passwordInput).toHaveClass("w-full", "p-2", "bg-gray-700");
  });
});
