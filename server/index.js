const express = require("express");
const app = express();
const cors = require("cors");
const KahootGame = require("./model/KahootGameModel");
const connectDB = require("./dbconnect");
const KahootPlayer = require("./model/kahootPlayerModel");
const http = require("http").Server(app);
const PORT = 4000;
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(cors());
let users = [];
connectDB();

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("JoinPlayer", (data) => {
    console.log(data);
    socketIO.emit("PLAYER_JOINED", data);
  });
  socket.on("newQuiz", (data) => {
    try {
      const dto = {
        game: JSON.stringify(data.quizData),
        id: socket.id,
        pin: data.gamePin,
      };
      const gamedto = new KahootGame(dto);
      gamedto
        .save()
        .then(() => {
          socket.emit("newQuiz", data);
        })
        .catch((error) => {
          console.error("Error saving data:", error);
        });
    } catch (err) {
      console.error("Error inserting new game data:", err);
      return null;
    }
  });
  socket.on("findGame", async (data) => {
    const game = await KahootGame.find({ pin: data.id });
    socket.emit("getgame", game);
  });
  socket.on("submitToServer", async (data) => {
    const player = await KahootPlayer.find({ nickname: data.nickname });
    const responses = data?.responses.map((item) => item.isCorrect);
    if (player[0].stats) {
      console.log("stas", data, JSON.parse(player[0].stats));
      let statsData = JSON.parse(player[0].stats).filter(
        (item) => item.pin == data.pin
      );
      if (statsData.length === 0) {
        //        let index=statsData[0
        statsData = [
          ...JSON.parse(player[0].stats),
          { gameId: data.id, correct: responses, pin: data.pin },
        ];
        const update = KahootPlayer.findByIdAndUpdate(player[0]._id, {
          stats: JSON.stringify(statsData),
        });
        update.then((res) => {
          socket.emit("submitResponse", true);
        });
      } else {
        socket.emit("submitResponse", true);
      }
    } else {
      const update = KahootPlayer.findByIdAndUpdate(player[0]._id, {
        stats: JSON.stringify([
          { gameId: data.id, correct: responses, pin: data.pin },
        ]),
      });
      update.then((res) => {
        socket.emit("submitResponse", true);
      });
    }

    // socket.emit("getgame", game);
  });
  socket.on("join-player", async (data) => {
    const dto = {
      id: socket.id,
      pin: data.gamePin,
      gameid: data.gameId,
      nickname: data.nickname,
      loggedin: true,
    };
    const playerdto = new KahootPlayer(dto);
    playerdto
      .save()
      .then(() => {
        socket.emit("newQuiz", data);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  });
  socket.on("getAllGames", async (data) => {
    const game = await KahootGame.find({});
    socket.emit("Games", game);
  });
  socket.on("showGamePin", (data) => socket.emit("showGamePin", data));
  socket.on("newUser", (data) => {
    users.push(data);
    socketIO.emit("newUserResponse", users);
  });
  socket.on("findgameforplayer", async (data) => {
    const game = await KahootGame.find({ pin: data.id });
    console.log(data);
    const player = await KahootPlayer.find({ nickname: data.nickname });

    if (player.length === 0) {
      const dto = {
        id: socket.id,
        pin: [data.id],
        gameid: game.id,
        nickname: data.nickname,
      };
      const playerdto = new KahootPlayer(dto);
      playerdto
        .save()
        .then(() => {
          socket.emit("fetchGame", game);
        })
        .catch((error) => {
          console.error("Error saving data:", error);
        });
    } else {
      if (player[0].pin.filter((item) => item != data.id).length == 0) {
        const update = await KahootPlayer.findByIdAndUpdate(player[0]._id, {
          pin: [...player[0].pin, data.id],
        });
      }
      socket.emit("fetchGame", game);
    }
  });
  socket.on("getPlayer", async (data) => {
    console.log(data);
    const player = await KahootPlayer.find({ pin: data });
    socket.emit("fetchPlayers", player);
  });
  socket.on("getPlayeronPlayerScreen", async (data) => {
    console.log(data);
    const player = await KahootPlayer.find({ pin: data });
    socket.emit("fetchPlayers", player);
  });
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    users = users.filter((user) => user.socketID !== socket.id);
    socketIO.emit("newUserResponse", users);
    socket.disconnect();
  });
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello" });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
