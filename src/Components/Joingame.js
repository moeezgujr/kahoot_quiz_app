import React, { useState } from "react";
import "../Styles/Joingames.css"; // Import the CSS file
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function JoinGame({ socket }) {
  const [pin, setPin] = useState("");
  const [nickname, setNickname] = useState("");
  const history = useHistory();
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(nickname, pin);
    socket.emit("findgameforplayer", { nickname, id: pin });
    socket.on("fetchGame", (data) => {
      history.push("/player/" + pin + "/" + nickname);
    });

    // socket.emit("JoinPlayer", {
    //   nickname: nickname,
    //   pin: parseInt(pin),
    //   id: socket.id,
    // });
  };
  return (
    <div className="container">
      <h1 className="title">Join a Game</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="label">Display Name</label>
          <input
            id="name"
            onChange={(e) => setNickname(e.target.value)}
            type="text"
            name="name"
            on
            autoFocus
          />
        </div>
        <br />
        <div className="form-field">
          <label className="label">Game Pin</label>
          <input
            id="pin"
            onChange={(e) => setPin(e.target.value)}
            type="number"
            name="pin"
          />
        </div>
        <br />
        <div className="form-field">
          <button id="joinButton">Join</button>
        </div>
      </form>
      <br />
      <center>
        <a href="/create/" id="host" className="host-link">
          Click here to host a Kahoot!
        </a>
      </center>
    </div>
  );
}

export default JoinGame;
