const mongoose = require("mongoose");

const KahootPlayerSchema = new mongoose.Schema({
  id: String,
  nickname: String,
  pin: Array,
  gameid: String,
  stats: String,
  loggedin:Boolean
});

const KahootPlayer = mongoose.model("kahootplayer", KahootPlayerSchema);

module.exports = KahootPlayer;
