import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "../Styles/quizresult.css";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
function QuizResult({ socket }) {
  // Sample data for the chart
  const { id, nickname, pin } = useParams();
  const [players, setPlayers] = useState({
    data: [],
    score: 0,
  });
  useEffect(() => {
    socket.emit("getPlayer", pin);
    socket.on("fetchPlayers", (data) => {
      console.log(data);
      const playerScores = data?.map((item) => {
        const _score = JSON.parse(item?.stats || "[]").find(
          (item) => item.correct && item.gameId == id
        ).correct;
        return {
          ...item,
          score: _score.filter((item) => item === true).length / _score.length,
        };
      });
      setPlayers({ ...players, data: playerScores });
    });
  }, [socket]);
  // Determine whether to display a congratulations or failure message
  let isQuizPassed = 0;
  let score = 0;
  if (players.data.length > 0) {
    score = (players.data.find((o) => o.nickname == nickname).score || 0) * 100;
    isQuizPassed = score >= 60; // You can customize the passing score
  }

  return (
    <div className="quiz-result">
      <h2>{isQuizPassed ? "Congratulations!" : "Oops! Quiz Failed!"}</h2>
      <p>Your Score: {score}%</p>
      <h2 id="winnerTitle">Top 5 Players</h2>
      {players.data.length > 0 &&
        players.data
          .filter((o) => o?.stats)
          .map((item, index) => {
            return (
              <div className="chart-container">
                <h3 id={`winner${index + 1}`}>
                  {`${index + 1}. 
                ${item.nickname} ${
                    isNaN(item.score) ? "--" : item.score * 100 + "%"
                  }`}
                </h3>
              </div>
            );
          })}

      {/* <Bar
          data={sampleChartData}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                max: 100, // Customize the max score as needed
                title: {
                  display: true,
                  text: "Score (%)",
                },
              },
            },
          }}
        /> */}
    </div>
  );
}

export default QuizResult;
