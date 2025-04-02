//Pagina de ver cursos - MARUCA
'use client';

import React from "react";
import "./verCursos.css";
import profilePicture from "./profilePicture.png";
import SidebarMenu from "@/app/components/SidebarMenu";

//ICONS
import WelcomeHubLogo from "./icons/WelcomeHubLogo";
import DashboardIcon from "./icons/DashboardIcon";
import CursosIcon from "./icons/CursosIcon";
import RetosIcon from "./icons/RetosIcon";
import BorisIcon from "./icons/BorisIcon";
import NeorisIcon from "./icons/NeorisIcon";
import SearchIcon from "./icons/SearchIcon";
import NotificationIcon from "./icons/NotificationIcon";
import SettingsIcon from "./icons/SettingsIcon";
import BullseyeIcon from "./icons/BullseyeIcon";
import ArrowIcon from "./icons/ArrowIcon";
import ClockIcon from "./icons/ClockIcon";

export default function VerCursos() {
  return (
    <div className="app-container">
      {/* SIDEBAR 
      <div className="sidebar-container">
        {/* SIDEBAR 
        <div className="sidebar-container">
          {/*Logo WelcomeHub*
          <div className="logo-container">
            <WelcomeHubLogo className="logo-image" />
          </div>

          <div className="menu-list">
            {/*Dashboard button
            <div className="menu-item">
              <DashboardIcon className="icon inactive-icon" />
              <div className="label inactive">Dashboard</div>
            </div>

            {/*Cursos button
            <div className="menu-item active">
              <CursosIcon className="icon active-icon" />
              <div className="label ">Cursos</div>
            </div>

            {/*Boris button
            <div className="menu-item">
              <BorisIcon className="icon inactive-icon" />
              <div className="label inactive">Boris IA</div>
            </div>

            {/*Retos button
            <div className="menu-item">
              <RetosIcon className="icon inactive-icon" />
              <div className="label inactive">Retos</div>
            </div>

            {/*Neoris button
            <div className="menu-item">
              <NeorisIcon className="icon inactive-icon" />
              <div className="label inactive">Neoris</div>
            </div>
          </div>
        </div>
      </div>
      */}

      <SidebarMenu />

      {/* CONTENT RIGHT */}
      <div className="page-wrapper">
        {/*NAVBAR*/}
        <div className="navbar">
          {/*Left*/}
          <div className="navbar-title">
            <div className="navbar-title-main">Mis Cursos</div>
            <div className="navbar-title-arrow">→</div>
            <div className="navbar-title-sub">Atencion a Clientes y Ventas</div>
          </div>

          {/*Right*/}
          <div className="navbar-right">
            <div className="navbar-status-bar">
              <SearchIcon className="icon-placeholder" />
            </div>

            <div className="navbar-icons">
              <SettingsIcon className="icon-placeholder" />
              <NotificationIcon className="icon-placeholder" />
              <Image
                src={profilePicture.src}
                alt="Profile"
                className="profile-pic"
              />
            </div>
          </div>
        </div>

        {/*MAIN CONTENT*/}
        <div className="main-content">
          <div className="main-inner">
            {/* MI PROGRESO */}
            <div className="progress-container">
              <div className="progress-header">
                <div className="progress-title">Mi Progreso</div>
                <div className="progress-percent">68% completado</div>
              </div>
              <div className="progress-bottom">
                <div className="progress-tracker-wrapper">
                  {/* Bar underneath */}
                  <div className="bar-total" />
                  <div className="bar-completed" style={{ width: "68%" }} />

                  {/* Steps on top */}
                  <div className="progress-steps">
                    <div className="step completed">1</div>
                    <div className="step completed">2</div>
                    <div className="step completed">3</div>
                    <div className="step remaining">4</div>
                    <div className="step remaining">5</div>
                  </div>
                </div>

                <div className="progress-legend">
                  <div className="legend-item">
                    <div className="dot green" />
                    <div className="legend-label">Completado</div>
                  </div>
                  <div className="legend-item">
                    <div className="dot gray" />
                    <div className="legend-label">Restante</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="course-row">
              <div className="course-description-card">
                <div className="course-title">Atencion al Cliente y Ventas</div>
                <div className="course-meta">
                  <div className="meta-item">
                    <div className="meta-label">Instructor:</div>
                    <div className="meta-value">David Hernandez Sanchez</div>
                  </div>
                  <div className="meta-item right">
                    <div className="meta-label">
                      Tiempo estimado de finalización:
                    </div>
                    <div className="meta-value">3 horas</div>
                  </div>
                </div>

                <div className="course-paragraph">
                  Este curso proporciona las habilidades esenciales para
                  interactuar de manera efectiva con los clientes, brindando un
                  servicio de calidad y potenciando las ventas. Incluye técnicas
                  de comunicación, resolución de problemas y estrategias de
                  persuasión para mejorar la experiencia del cliente y alcanzar
                  mejores resultados comerciales.
                </div>

                <div className="learning-section">
                  <div className="learning-title">Puntos de Aprendizaje</div>

                  <div className="learning-columns">
                    <div className="learning-column">
                      <div className="learning-point">
                        <div className="bullet-container">
                          <div className="large-circle" />
                          <div className="small-circle" />
                        </div>
                        <div className="learning-text">
                          Desarrollar habilidades de comunicación efectiva
                        </div>
                      </div>
                      <div className="learning-point">
                        <div className="bullet-container">
                          <div className="large-circle" />
                          <div className="small-circle" />
                        </div>
                        <div className="learning-text">
                          Aplicar técnicas de ventas estratégicas
                        </div>
                      </div>
                    </div>

                    <div className="learning-column">
                      <div className="learning-point">
                        <div className="bullet-container">
                          <div className="large-circle" />
                          <div className="small-circle" />
                        </div>
                        <div className="learning-text">
                          Manejar objeciones y resolver problemas con clientes
                        </div>
                      </div>
                      <div className="learning-point">
                        <div className="bullet-container">
                          <div className="large-circle" />
                          <div className="small-circle" />
                        </div>
                        <div className="learning-text">
                          Comprender la psicología del consumidor
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="course-stats">
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

                <div className="time-card">
                  <div className="card-title">Tiempo Promedio</div>
                  <div className="score-value">
                    <div className="score-main">
                      <div className="time-number">45</div>
                      <div className="time-unit">min/dia</div>
                    </div>
                    <ClockIcon className="stat-icon" />
                  </div>
                  <div className="score-info">
                    <ArrowIcon className="arrow-icon arrow-down" />
                    <span className="highlight">5.6%</span>
                    <span className="normal">mas</span>
                    <span className="highlight-bold">bajo</span>
                    <span className="normal">que el promedio.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LISTA DE MODULOS */}
            <div className="modules-wrapper">
              <div className="modules-header">Modulos</div>

              <div className="module-card">
                <div className="module-summary">
                  <div className="module-title">
                    <div className="module-status-circle green" />
                    <div className="module-name">
                      <span className="module-name-number">Modulo 1:</span>
                      <span className="module-name-text">
                        Fundamentos de la Atención al Cliente
                      </span>
                    </div>
                  </div>

                  <div className="module-meta">
                    <div className="module-progress completed">
                      <div className="module-progress-number">4/4</div>
                      <div className="module-progress-label">Completado</div>
                    </div>
                    <div className="module-arrow" />
                  </div>
                </div>

                <div className="module-content">
                  <div className="module-description">
                    <div className="description-title">
                      Descripcion de Modulo
                    </div>
                    <div className="description-text">
                      Este módulo introduce los principios clave de la atención
                      al cliente, destacando la importancia de la comunicación
                      efectiva y la empatía en la experiencia del consumidor.
                    </div>
                  </div>

                  <div className="module-subsections">
                    <div className="subsections-title">Subsecciones</div>
                    {/* Repeat .subsection-item for each item */}
                    <div className="subsection-item">
                      <div className="subsection-left">
                        <div className="subsection-index">1</div>
                        <div className="subsection-text">
                          Importancia de la atención al cliente en las ventas
                        </div>
                      </div>
                      <div className="subsection-status completed">
                        Completado
                      </div>
                    </div>
                    {/* Repeat as needed */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END OF MAIN CONTENT RIGHT */}
        </div>
      </div>
    </div>
  );
}
