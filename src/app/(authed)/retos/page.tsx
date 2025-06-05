"use client";

//* Styles *//
import "./retos.css";

import UserStats from "./assets/UserStats";
import RetosTable from "./assets/retosTable";
import RankingPodium from "./assets/RankingPodium";
import useVerificarProgreso from '@/app/hooks/useVerificarProgreso';


export default function Retos() {
  useVerificarProgreso();
  return (
    <div className="main-content">
      <div className="retos-page">
        <UserStats />

        <div className="retos-container">
          <RetosTable />
        </div>
        <RankingPodium />
        {/*<Logros /> Quitar por ahora*/}
      </div>
    </div>
  );
}
