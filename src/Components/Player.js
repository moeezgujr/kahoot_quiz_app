import React, { useEffect, useState } from "react";
import "../Styles/lobby.css"; // Import the CSS file
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

function Player({ socket }) {
  const { id, nickname } = useParams();
  const [players, setPlayers] = useState([]);
  useEffect(() => {
    socket.emit("getPlayeronPlayerScreen", id);
    socket.on("fetchPlayers", (data) => {
      setPlayers(data);
    });
    return () => {
      socket.off("PLAYER_JOINED");
    };
  }, [socket]);
  const goToGame = () => {
    window.location = "/host-game/" + id + "/" + nickname;
  };
  return (
    <div className="lobby-container">
      <h1 id="title1">Waiting on host to start the game</h1>
      <h3 id="title2">Do you see your name on the screen?</h3>
      {/* <div className="loader"></div> */}

      {/* List of player cards */}
      <div className="player-list">
        {players.map((player, index) => (
          <div className="player-card" key={index}>
            <img
              className="profile-picture"
              src={
                "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
              }
              alt={`Profile of ${player.nickname}`}
            />
            <h2>{player.nickname}</h2>
            {/* Add a "Continue" button */}
            {player.nickname === nickname && (
              <button className="continue-button" onClick={goToGame}>
                Continue
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Player;
