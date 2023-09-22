import React, { useEffect, useState } from "react";
import "../Styles/Host.css"; // Import the CSS file
import { useHistory } from "react-router-dom";

function Host({ socket }) {
  const [pin, setPin] = useState("");
  const history = useHistory();
  const endGame = () => {
    history.push("/");
    // Implement the logic to end the game
  };
  useEffect(() => {
    socket.on("showGamePin", (data) => {
      setPin(data);
    });
  }, []);

  const startGame = () => {
    history.push("/");
    // Implement the logic to start the game
  };

  return (
    <div className="host-container">
      <button id="cancel" onClick={endGame}>
        Cancel Game
      </button>
      <h2 id="title">Join this Game using the Game Pin: {pin} </h2>
      <h1 id="gamePinText"></h1>
      <textarea className="players" readOnly id="players"></textarea>
      <br />
      <button id="start" onClick={startGame}>
        Start Game
      </button>
    </div>
  );
}

export default Host;
