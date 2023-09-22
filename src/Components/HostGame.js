import React, { useEffect, useState } from "react";
import "../Styles/Hostgame.css"; // Import the CSS file
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function HostGame({ socket }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameProps, setGameProps] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [gameData, setGameData] = useState(null); // State to store the parsed game data
  const [currentQuestionIndex, setcurrentQuestionIndex] = useState(0);
  const [playerLength, setplayerLength] = useState({
    total: 0,
    attempted: 0,
    isAttempted: false,
  });

  const { id, nickname } = useParams();

  useEffect(() => {
    socket.emit("getPlayer", id);
    socket.on("fetchPlayers", (data) => {
      setplayerLength({
        attempted: data.filter((item) => item.stats).length,
        total: data.length,
        isAttempted:
          JSON.parse(
            data.find((item) => item?.nickname == nickname)?.stats || "{}"
          ) || {},
      });
    });
    socket.emit("findGame", {
      id,
    });
    socket.on("getgame", (data) => {
      if (data && data.length > 0) {
        // Parse the 'game' property from the response JSON string
        const gameObj = JSON.parse(data[0].game);
        setGameProps(data);
        setGameData(gameObj); // Store the parsed game data in the state
      }
    });
  }, [id, socket]);

  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    setcurrentQuestionIndex(nextIndex);
    if (nextIndex < gameData.questions.length) {
      setSelectedAnswer(null); // Reset the selected answer
      setIsCorrect(null); // Reset the result display
      // Implement the logic to move to the next question
    } else {
      // All questions have been answered
      // Implement logic for game completion
    }
  };
  const goToPreviousQuestion = () => {
    const prevIndex = currentQuestionIndex - 1;
    if (prevIndex >= 0) {
      setcurrentQuestionIndex(prevIndex);
      setSelectedAnswer(null); // Reset the selected answer
      setIsCorrect(null); // Reset the result display
    }
  };
  const handleAnswerClick = (answer) => {
    const currentQuestion = gameData.questions[currentQuestionIndex];
    const isAnswerCorrect =
      answer === currentQuestion.answers[currentQuestion.correctAnswer - 1];
    setSelectedAnswer(answer);
    setIsCorrect(isAnswerCorrect);
  };
  const history = useHistory();
  const submitQuestion = () => {
    socket.emit("submitToServer", {
      nickname,
      isCorrect,
      pin: id,
      id: gameProps[0].id,
    });
    socket.on("submitResponse", (data) => {
      console.log(data);

      history.push("/quizresult/" + gameProps[0].id + "/" + nickname+ "/"+id);
    });
  };
  let link = "";
  if (gameProps && gameProps.length > 0) {
    link = `/quizresult/${gameProps[0]?.id || 0}/${nickname}/${id}`;
  }
  if (
    Object.keys(playerLength.isAttempted).length > 0 &&
    playerLength.isAttempted.find((item) => item.pin == id)
  ) {
    return (
      <div className="game-container">
        <h1>
          Quiz Already Attempted by {nickname}. Please see the stats{" "}
          <a href={link}>here</a>
        </h1>
      </div>
    );
  } else
    return (
      <div className="game-container">
        <h4 id="questionNum">
          {currentQuestionIndex + 1} / {gameData?.questions?.length || 0}
        </h4>
        <h4 id="playersAnswered">
          Players Answered: {playerLength.attempted} / {playerLength.total}
        </h4>
        <h3 id="timerText">{/* Time Left:<span id="num"> 20</span> */}</h3>

        <div className="square" id="square1"></div>
        <div className="square" id="square2"></div>
        <div className="square" id="square3"></div>
        <div className="square" id="square4"></div>

        <div className="card">
          <div className="card-body">
            <h2 id="question" className="card-title">
              {gameData?.questions[currentQuestionIndex]?.questionText || 0}
            </h2>
            {gameData &&
              gameData.questions.length > 0 &&
              gameData.questions[currentQuestionIndex].answers.map(
                (answer, index) => (
                  <div
                    key={index}
                    className={`answer-card ${
                      selectedAnswer === answer
                        ? isCorrect
                          ? "correct"
                          : "incorrect"
                        : ""
                    }`}
                    onClick={() => handleAnswerClick(answer)}
                  >
                    {answer}
                  </div>
                )
              )}
          </div>
        </div>

        <br />
        <div className="actions">
          <button onClick={submitQuestion} id="nextQButton">
            Submit to Server
          </button>
          {/* {gameData.questions.length > 1 && (
            <>
              <button onClick={goToPreviousQuestion} id="prevQButton">
                Previous Question
              </button>
              <button onClick={nextQuestion} id="nextQButton">
                Next Question
              </button>
            </>
          )} */}
        </div>
      </div>
    );
}

export default HostGame;
