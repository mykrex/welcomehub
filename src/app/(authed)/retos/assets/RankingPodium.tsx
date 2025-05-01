import React from "react";
import "./rankingPodium.css";
import TrophyIcon from "./trophyIcon";
import Image from "next/image";
import SecondPlaceMedal from "./SecondPlaceMedal";
import ThirdPlaceMedal from "./ThirdPlaceMedal";


//* FAKE API
import {useState, useEffect, Fragment} from "react";
import {getUsers} from "../../api/users/users";

const rankingData = [
  {
    name: "Rafael Pereira",
    points: 902,
    rank: 4,
    image: "/Avatars/avatar (4).jpg",
  },
  {
    name: "Gabriel David Cruz Martinez",
    points: 887,
    rank: 5,
    image: "/Avatars/avatarGabriel.jpg",
  },
  {
    name: "Gabrielly Tavares",
    points: 850,
    rank: 6,
    image: "/Avatars/avatar (5).jpg",
  },
  {
    name: "Renan Matos",
    points: 657,
    rank: 7,
    image: "/Avatars/avatar (6).jpg",
  },
  {
    name: "Hugo Souza",
    points: 433,
    rank: 8,
    image: "/Avatars/avatar (7).jpg",
  },
  {
    name: "Jessica Silva",
    points: 201,
    rank: 9,
    image: "/Avatars/avatar (8).jpg",
  },
  {
    name: "Fernando Lima",
    points: 198,
    rank: 10,
    image: "/Avatars/avatar (9).jpg",
  },
];

export default function RankingPodium() {
  return (
    <div className="ranking-container">
      <div className="ranking-header">
        <div className="ranking-title">Ranking de Equipo |</div>
        <div className="ranking-subtitle">All Time</div>
      </div>

      <div className="ranking-content">
        <div className="podium-container">
          {/* SEGUNDO LUGAR */}
          <div className="podium-item">
            <div className="profile-card">
              <Image
                className="profile-picture"
                src="/Avatars/avatar (2).jpg"
                alt="Profile picture"
                width={130}
                height={126}
              />
              <div className="profile-name-container profile-name-container--second">
                <div className="profile-name">Roberta Valdes</div>
              </div>
            </div>

            <div className="points-card points-card--second">
              <SecondPlaceMedal />
              <div className="points-info">
                <div className="points-number">998</div>
                <div className="points-label">Puntos</div>
              </div>
            </div>
          </div>

          {/* PRIMER LUGAR */}
          <div className="podium-item">
            <div className="profile-card">
              <Image
                className="profile-picture"
                src="/Avatars/avatar1.jpg"
                alt="Profile picture"
                width={130}
                height={126}
              />
              <div className="profile-name-container profile-name-container--first">
                <div className="profile-name">Antonio Garza</div>
              </div>
            </div>

            <div className="points-card">
              <TrophyIcon />
              <div className="points-info">
                <div className="points-number">1097</div>
                <div className="points-label">Puntos</div>
              </div>
            </div>
          </div>

          {/* Podium Item (repeat for third) */}
          <div className="podium-item">
            <div className="profile-card">
              <Image
                className="profile-picture"
                src="/Avatars/avatar (3).jpg"
                alt="Profile picture"
                width={130}
                height={126}
              />
              <div className="profile-name-container profile-name-container--third">
                <div className="profile-name">David Juarez</div>
              </div>
            </div>

            <div className="points-card points-card--third">
              <ThirdPlaceMedal />
              <div className="points-info">
                <div className="points-number">903</div>
                <div className="points-label">Puntos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="ranking-table">
          <div className="ranking-table-header">
            <div className="ranking-header-item">Rank</div>
            <div className="ranking-header-item">Colaborador</div>
            <div className="ranking-header-item">Puntos</div>
          </div>

          <div className="ranking-divider" />

          <div className="ranking-table-body">
            {rankingData.map((user, index) => (
              <div key={index} className="ranking-row">
                <div className="ranking-rank">{user.rank}</div>
                <Image
                  className="profile-picture-small"
                  src={user.image}
                  alt={`Profile of ${user.name}`}
                  width={61}
                  height={61}
                />
                <div className="ranking-name">{user.name}</div>

                <div className="ranking-points">{user.points}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
