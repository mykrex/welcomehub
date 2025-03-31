//Pagina de ver cursos - MARUCA
import React from "react";
import "./verCursos.css";
import logo24 from "./whLogo24.png";
import profilePicture from "./profilePicture.png";

//ICONS
import DashboardIcon from "./icons/DashboardIcon";
import CursosIcon from "./icons/CursosIcon";
import RetosIcon from "./icons/RetosIcon";
import BorisIcon from "./icons/BorisIcon";
import NeorisIcon from "./icons/NeorisIcon";
import SearchIcon from "./icons/SearchIcon";
import NotificationIcon from "./icons/NotificationIcon";
import SettingsIcon from "./icons/SettingsIcon";

export default function VerCursos() {
  return (
    <div className="app-container">
      <div className="sidebar-container">
        {/* SIDEBAR */}
        <div className="sidebar-container">
          {/*Logo WelcomeHub*/}
          <div className="logo-container">
            <img src={logo24.src} alt="Logo" className="logo-image" />
          </div>

          <div className="menu-list">
            {/*Dashboard button*/}
            <div className="menu-item">
              <DashboardIcon className="icon inactive-icon" />
              <div className="label inactive">Dashboard</div>
            </div>

            {/*Cursos button*/}
            <div className="menu-item active">
              <CursosIcon className="icon active-icon" />
              <div className="label ">Cursos</div>
            </div>

            {/*Boris button*/}
            <div className="menu-item">
              <BorisIcon className="icon inactive-icon" />
              <div className="label inactive">Boris IA</div>
            </div>

            {/*Retos button*/}
            <div className="menu-item">
              <RetosIcon className="icon inactive-icon" />
              <div className="label inactive">Retos</div>
            </div>

            {/*Neoris button*/}
            <div className="menu-item">
              <NeorisIcon className="icon inactive-icon" />
              <div className="label inactive">Neoris</div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT RIGHT */}
      <div className="page-wrapper">
        {/*NAVBAR*/}
        <div className="navbar">
          {/*Left*/}
          <div className="navbar-title">
            Mis Cursos | Atencion al Cliente y Ventas
          </div>

          {/*Right*/}
          <div className="navbar-right">
            <div className="navbar-status-bar">
              <SearchIcon className="icon-placeholder" />
            </div>

            <div className="navbar-icons">
              <SettingsIcon className="icon-placeholder" />
              <NotificationIcon className="icon-placeholder" />
              <img
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


            {/*Progress bar*/}
            <div className="progress-container">
              <div className="progress-card">
                <div className="progress-header">
                  <div className="progress-label">Mi Progreso</div>
                  <div>
                    <span className="progress-percent">68% </span>
                    <span className="progress-completed-text">completado</span>
                  </div>
                </div>

                <div className="progress-line-wrapper">
                  <div className="progress-line-bg">
                    <div
                      className="progress-line-fill"
                      style={{ width: "68%" }}
                    />
                  </div>
                  <div className="progress-circles">
                    <div className="circle completed">1</div>
                    <div className="circle completed">2</div>
                    <div className="circle completed">3</div>
                    <div className="circle remaining">4</div>
                    <div className="circle remaining">5</div>
                  </div>
                </div>

                <div className="progress-legend">
                  <div className="legend-item">
                    <div className="legend-dot green" />
                    <div className="legend-text">Completado</div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot gray" />
                    <div className="legend-text">Restante</div>
                  </div>
                </div>
              </div>{" "}
              {/* END OF PROGRESS CARD */}
            </div>


            {/*COURSE CARD*/}
            <div className="course-page">
              <div className="course-card">
                <div className="course-main">
                  <div className="course-info">
                    <div className="course-title">
                      Atencion al Cliente y Ventas
                    </div>
                    <div className="course-description">
                      Este curso proporciona las habilidades esenciales para
                      interactuar de manera efectiva con los clientes, brindando
                      un servicio de calidad y potenciando las ventas. Incluye
                      técnicas de comunicación, resolución de problemas y
                      estrategias de persuasión para mejorar la experiencia del
                      cliente y alcanzar mejores resultados comerciales.
                    </div>
                    <div className="course-meta">
                      <div className="instructor-info">
                        <img
                          src="https://placehold.co/50x50"
                          className="instructor-avatar"
                        />
                        <div className="instructor-text">
                          <span className="instructor-label">Instructor: </span>
                          <span className="instructor-name">
                            David Hernandez Sanchez
                          </span>
                        </div>
                      </div>
                      <div className="course-duration">
                        <span className="duration-label">
                          Tiempo estimado de finalización:{" "}
                        </span>
                        <span className="duration-time">3 horas</span>
                      </div>
                    </div>
                  </div>
                  <img
                    className="course-image"
                    src="https://placehold.co/195x205"
                  />
                </div>

                <div className="learning-title">Lo que aprenderás</div>
                <div className="learning-points">
                  <div className="point-column">
                    <div className="point">
                      <div className="bullet" />
                      <div className="text">
                        Desarrollar habilidades de comunicación efectiva
                      </div>
                    </div>
                    <div className="point">
                      <div className="bullet" />
                      <div className="text">
                        Aplicar técnicas de ventas estratégicas
                      </div>
                    </div>
                  </div>
                  <div className="point-column">
                    <div className="point">
                      <div className="bullet" />
                      <div className="text">
                        Manejar objeciones y resolver problemas con clientes
                      </div>
                    </div>
                    <div className="point">
                      <div className="bullet" />
                      <div className="text">
                        Comprender la psicología del consumidor
                      </div>
                    </div>
                  </div>
                </div>
              </div>




              <div className="course-stats">
                <div className="score-card">
                  <div className="score-title">Mi Puntaje</div>
                  <div className="score-value">
                    <span className="score-number">92</span>
                    <span className="score-percent">%</span>
                    <div className="score-bar" />
                  </div>
                  <div className="score-info">
                    <span className="score-highlight">13.7%</span>
                    <span className="score-comparison"> mas </span>
                    <span className="score-high">alto</span>
                    <span className="score-comparison"> que el promedio!</span>
                  </div>
                </div>

                <div className="time-card">
                  <div className="time-title">Mi Tiempo Promedio</div>
                  <div className="time-value">
                    <span className="time-number">45</span>
                    <span className="time-unit">min</span>
                    <div className="time-icon">
                      <div className="clock-face" />
                      <div className="clock-hand" />
                    </div>
                  </div>
                  <div className="time-info">
                    <span className="time-highlight">6.7%</span>
                    <span className="time-comparison"> mas </span>
                    <span className="time-high">alto</span>
                    <span className="time-comparison"> que el promedio</span>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* END OF COURSE PAGE */}
          </div>
          {/* END OF MAIN CONTENT RIGHT */}
        </div>
      </div>
    </div>
  );
}
