"use client";
import React from "react";

//* STYLES *//
import "./statsCard.css";

//* Assets *//
import BullseyeIcon from "./icons/BullseyeIcon";
import ArrowIcon from "./icons/ArrowIcon";


export default function StatsCard() {
  return (
    <div className="score-card">
      <div className="card-title">Puntaje Promedio</div>

      <div className="score-value">
        <div className="score-main">
          <div className="score-number">92</div>
          <div className="score-percent">%</div>
        </div>
        <BullseyeIcon className="stat-icon" />
      </div>

      <div className="score-info">
        <ArrowIcon className="arrow-icon arrow-up" />
        <span className="highlight">13.7%</span>
        <span className="normal">mas</span>
        <span className="highlight-bold">alto</span>
        <span className="normal">que el promedio!</span>
      </div>
    </div>
  );
}
