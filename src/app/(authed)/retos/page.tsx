"use client";

//* Styles *//
import "./retos.css";

import UserStats from "./assets/UserStats";
import RetosTable from "./assets/retosTable";
import RankingPodium from "./assets/RankingPodium";
import useVerificarProgreso from '@/app/hooks/useVerificarProgreso';


//import Logros from "./assets/Logros";

function getCurrentWeekRange(): string {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };
  const format = (date: Date): string =>
    date
      .toLocaleDateString("es-MX", options)
      .replace(
        /(^\d+ de )(\w)/,
        (_, prefix, firstLetter) => prefix + firstLetter.toUpperCase()
      );
  const start = format(monday);
  const end = format(sunday);
  return `${start} - ${end}`;
}

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
