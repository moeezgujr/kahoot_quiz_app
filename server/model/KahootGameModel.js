const mongoose = require("mongoose");

const KahootGameSchema = new mongoose.Schema({
  id: String,
  game: String,
  pin:Number,
});

const KahootGame = mongoose.model("kahootgames", KahootGameSchema);

module.exports = KahootGame;
