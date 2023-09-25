import React, { useEffect, useState } from "react";
import "../Styles/Joingames.css"; // Import the CSS file
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function JoinGame({ socket }) {
  const { id } = useParams();

  const [pin, setPin] = useState("");
  const [nickname, setNickname] = useState("");
  const history = useHistory();
  console.log(id);

  useEffect(() => {
    if (id) {
      setPin(id);
    }
  }, [id]);
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(nickname, pin);
    socket.emit("findgameforplayer", { nickname, id: pin });
    socket.on("fetchGame", (data) => {
      console.log(data);
      if (data.length > 0) {
        history.push("/player/" + pin + "/" + nickname);
      } else {
        toast.error("This pin doesnt exist")
      }
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
            required
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
            value={pin}
            required
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
