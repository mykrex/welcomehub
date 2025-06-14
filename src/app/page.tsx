"use client";

import { useRouter } from "next/navigation";
import WelcomeHubLogo from "./components/(icons)/WelcomeHubLogo";
import "./(landing)/landing/landing.css";

import SmallBG from "./(landing)/landing/smallBG";
import BigBG from "./(landing)/landing/bigBG";

export default function LandingPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="landing-container">
      <div className="content-wrapper">
        <WelcomeHubLogo className="logo" />

        <div className="middle-wrapper">
          <div className="heading">
            <div className="camino">Tu camino,</div>
            <div className="guia">nuestra guía</div>
          </div>

          <div className="bottom">
            <div className="subtitle">
              Empieza tu recorrido con el apoyo que necesitas,
              <br />
              diseñada para impulsar tu crecimiento profesional.
            </div>
            <button onClick={handleLogin} className="login-button">
              Inicia Sesión
            </button>
          </div>
        </div>
      </div>

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
