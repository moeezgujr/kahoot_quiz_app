import React, { useEffect, useState } from "react";
import "../Styles/create.css"; // Import the CSS file
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";

function Create({ socket }) {
  const [games, setGames] = useState([]); // State to store the list of games
  useEffect(() => {
    socket.emit("getAllGames", (data) => {});
    socket.on("Games", (data) => {
      console.log(data);
      const data1 = data.map((item) => {
        return { id: item.id, title: JSON.parse(item.game) };
      });
      setGames(data1);
    });
  }, [socket]);
  const history = useHistory();
  const goToPlay = (id) => {
    history.push("/host-game/" + id);
  };
  return (
    <div className="container">
      <a id="back" href="/">
        Back
      </a>
      <h1 id="title">Start a Kahoot Game</h1>
      <h4 id="subtitle">
        Choose a Game Below or{" "}
        <a id="link" href="/quiz-creator">
          Create your Own!
        </a>
      </h4>
      <div id="game-list">
        {games.map((game) => (
          <div key={game.id} className="game-card">
            <h2>{game.title.quizTitle}</h2>
            <button onClick={() => goToPlay(game.id)}>Select</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Create;
