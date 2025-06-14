"use client";

import "./retos.css";

import UserStats from "../../components/(retos)/UserStats";
import RetosTable from "../../components/(retos)/Table";
import RankingPodium from "../../components/(retos)/RankingPodium";
import useVerificarProgreso from "@/app/hooks/useVerificarProgreso";

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
      </div>
    </div>
  );
}
