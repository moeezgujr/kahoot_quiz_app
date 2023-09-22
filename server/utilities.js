const KahootGame = require("./model/KahootGameModel");

const insertNewGame = async (gameData) => {
  try {
    const gamedto = new KahootGame(gameData);
    return await gamedto.save();
  } catch (err) {
    console.error("Error inserting new game data:", err);
    return null;
  }
};
