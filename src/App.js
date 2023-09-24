import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import JoinGame from "./Components/Joingame";
import Create from "./Components/Create";
import QuizCreator from "./Components/Quizcreator";
import Host from "./Components/Host";
import HostGame from "./Components/HostGame";
import Player from "./Components/Player";
import socketIO from "socket.io-client";
import QuizResult from "./Components/QuizResult";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function AppRouter() {
  const socket = socketIO.connect("http://localhost:4000");

  return (
    <Router>
              <ToastContainer />

      <Switch>

        <Route
          path="/create"
          render={(props) => <Create {...props} socket={socket} />}
        />
        <Route
          path="/quizresult/:id/:nickname/:pin"
          render={(props) => <QuizResult {...props} socket={socket} />}
        />
        <Route
          path="/quiz-creator"
          render={(props) => <QuizCreator {...props} socket={socket} />}
        />
        <Route
          path="/host"
          render={(props) => <Host {...props} socket={socket} />}
        />
        <Route
          path="/host-game/:id/:nickname"
          render={(props) => <HostGame {...props} socket={socket} />}
        />
        <Route
          path="/player/:id/:nickname"
          render={(props) => <Player {...props} socket={socket} />}
        />
        <Route
          path="/"
          render={(props) => <JoinGame {...props} socket={socket} />}
        />
      </Switch>
    </Router>
  );
}

export default AppRouter;
