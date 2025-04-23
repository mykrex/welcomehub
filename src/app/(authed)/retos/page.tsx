"use client";
import "./retos.css";
import RetosImg from './Ranking.png';
import Image from "next/image";
import "@/app/components/(layout)/layout.css";

export default function Retos() {
  return (
    <div className="app-container">
      <div className="retos-page">
        <div className="retos-container">
          {/* ───────── header ───────── */}
          <div className="retos-header">
            <span className="retos-title">Mis Retos |</span>
            <span className="retos-date">Abril 7 → Abril 11</span>
          </div>

          {/* ───────── table ───────── */}
          <div className="retos-table">
            {/* column labels */}
            <div className="retos-row retos-row--header">
              <div className="retos-cell retos-cell--status">Estatus</div>
              <div className="retos-cell retos-cell--type">Tipo De Reto</div>
              <div className="retos-cell retos-cell--points">Puntos</div>
              <div className="retos-cell retos-cell--description">
                Descripción
              </div>
              <div className="retos-cell retos-cell--assigned">
                Asignado por:
              </div>
              <div className="retos-cell retos-cell--progress">Progreso</div>
            </div>

            {/* streak row */}
            <div className="retos-row retos-row--even">
              <div className="retos-cell retos-cell--status">
                <span className="status-icon status-icon--complete" />
              </div>
              <div className="retos-cell retos-cell--type streak">
                ⚡ Streak
              </div>
              <div className="retos-cell retos-cell--points streak">+ 500</div>
              <div className="retos-cell retos-cell--description desc">
                Cursar 10 minutos en Global Campus diario por 5 días
              </div>
              <div className="retos-cell retos-cell--assigned">
                <div className="progress-bar">
                  <div className="progress-thumb" />
                </div>
              </div>
              <div className="retos-cell retos-cell--progress">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="dot" />
                ))}
              </div>
            </div>

            {/* challenge row */}
            <div className="retos-row retos-row--odd">
              <div className="retos-cell retos-cell--status">
                <span className="status-icon status-icon--pending" />
              </div>
              <div className="retos-cell retos-cell--type challenge">
                🥊 Challenge
              </div>
              <div className="retos-cell retos-cell--points challenge">
                + 800
              </div>
              <div className="retos-cell retos-cell--description desc">
                Terminar curso de Atención al Cliente y Ventas
              </div>
              <div className="retos-cell retos-cell--assigned">
                <span className="assigned-name">Maria Quetzalli</span>
              </div>
              <div className="retos-cell retos-cell--progress">
                <span className="progress-text">63 % completado</span>
              </div>
            </div>
          </div>
        </div>

        {/*
        <div className="team-ranking">
          <div className="team-ranking__header">
            <span className="team-ranking__title">Ranking de Equipo |</span>
            <span className="team-ranking__date">All Time</span>
          </div>

          <div className="podium">
            <div className="podium-card silver">
              <div className="podium-avatar" />
              <img
                src="https://placehold.co/130x126"
                alt="Roberta Valdes"
                className="podium-img"
              />
              <span className="podium-name">Roberta Valdes</span>
              <div className="points-card silver">
                <span className="podium-rank">2</span>
                <div className="points">
                  <span className="points-value">998</span>
                  <span className="points-label">Puntos</span>
                </div>
              </div>
            </div>

            <div className="podium-card gold">
              <div className="podium-trophy" />
              <span className="points-value gold-big">1097</span>
              <span className="points-label">Puntos</span>
            </div>

            <div className="podium-card bronze">
              <div className="podium-avatar" />
              <img
                src="https://placehold.co/130x126"
                alt="Justin Bieber"
                className="podium-img"
              />
              <span className="podium-name">Justin Bieber</span>
              <div className="points-card bronze">
                <span className="podium-rank">3</span>
                <div className="points">
                  <span className="points-value">903</span>
                  <span className="points-label">Puntos</span>
                </div>
              </div>
            </div>
          </div>

          <ul className="ranking-list">
            <li className="ranking-row">
              <span className="ranking-points">198</span>
              <span className="ranking-name">Fernando Lima</span>
              <span className="ranking-rank">10</span>
            </li>
            <li className="ranking-row">
              <span className="ranking-points">201</span>
              <span className="ranking-name">Jessica Silva</span>
              <span className="ranking-rank">9</span>
            </li>
            <li className="ranking-row">
              <span className="ranking-points">433</span>
              <span className="ranking-name">Hugo Souza</span>
              <span className="ranking-rank">8</span>
            </li>
          </ul>

          <div className="ranking-footer">
            <span className="footer-label">Puntos</span>
            <span className="footer-label">Colaborador</span>
            <span className="footer-label">Rank</span>
          </div>
        </div> 
        */}

        <Image src={RetosImg} alt="Retos" width={1230}/>

      </div>
    </div>
  );
}
