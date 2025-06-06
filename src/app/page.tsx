// src/app/page.tsx

"use client";

import { useRouter } from "next/navigation";
import WelcomeHubLogo from "./components/(layout)/assetsLayout/WelcomeHubLogo";
import "./landing/landing.css";

// Assets para animar
import SmallBG from "./landing/smallBG";
import BigBG from "./landing/bigBG";

export default function LandingPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="landing-container">
      {/** ← Mitad izquierda: contenido fijo */}
      <div className="content-wrapper">
        <WelcomeHubLogo className="logo" />

        <div className="middle-wrapper">
          <div className="heading">
            <div className="camino">Tu camino,</div>
            <div className="guia">nuestra guía</div>
          </div>

          <div className="bottom">
            <div className="subtitle">
              Empieza tu recorrido con el apoyo que necesitas,<br />
              diseñada para impulsar tu crecimiento profesional.
            </div>
            <button onClick={handleLogin} className="login-button">
              Inicia Sesión
            </button>
          </div>
        </div>
      </div>

      {/** ← Mitad derecha: contenedor de animación */}
      <div className="animation-wrapper">
        <div className="small-bg-wrapper">
          <SmallBG />
        </div>

        <div className="big-bg-wrapper">
          <BigBG />
        </div>
      </div>
    </div>
  );
}
