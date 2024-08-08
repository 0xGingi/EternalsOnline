const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3011;
const GUILDS = require('./modules/squad.js');
const PLAYERS = require('./modules/player.js');
const BALANCES = require('./modules/economie.js');
const PARTIES = require('./modules/party.js');
const STATS = require('./modules/statsBot.js');
mongoose.connect('');

/*app.get('/leaderboard/xp', async (req, res) => {
  try {
    const leaderboard = await BALANCES.find({}, { 'eco.totalxp': 1, pseudo: 1 }).sort({ 'eco.totalxp': -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error);
  }
});
*/
app.get('/leaderboard/xp', async (req, res) => {
  try {
    const leaderboard = await BALANCES.aggregate([
      {
        $lookup: {
          from: "players",
          localField: "pseudo",
          foreignField: "pseudo",
          as: "player_info"
        }
      },
      {
        $unwind: "$player_info"
      },
      {
        $project: {
          pseudo: 1,
          totalxp: "$eco.totalxp",
          level: "$player_info.player.level"
        }
      },
      {
        $sort: { totalxp: -1 }
      }
    ]);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/leaderboard/coins', async (req, res) => {
  try {
    const leaderboard = await BALANCES.aggregate([
      {
        $lookup: {
          from: "players",
          localField: "pseudo",
          foreignField: "pseudo",
          as: "player_info"
        }
      },
      {
        $unwind: "$player_info"
      },
      {
        $addFields: {
          totalCoins: { $add: ["$eco.coins", "$player_info.player.bank.coins"] }
        }
      },
      {
        $project: {
          pseudo: 1,
          totalCoins: 1
        }
      },
      {
        $sort: { totalCoins: -1 }
      }
    ]);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/leaderboard/fishing', async (req, res) => {
  try {
    const leaderboard = await PLAYERS.find({}, { 'player.fishing.totalxp': 1, 'player.fishing.level':1, pseudo: 1 }).sort({ 'player.fishing.totalxp': -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/leaderboard/mining', async (req, res) => {
  try {
    const leaderboard = await PLAYERS.find({}, { 'player.mining.totalxp': 1, 'player.mining.level':1, pseudo: 1 }).sort({ 'player.mining.totalxp': -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/leaderboard/woodcutting', async (req, res) => {
  try {
    const leaderboard = await PLAYERS.find({}, { 'player.woodcutting.totalxp': 1,'player.woodcutting.level':1, pseudo: 1 }).sort({ 'player.woodcutting.totalxp': -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/leaderboard/smithing', async (req, res) => {
  try {
    const leaderboard = await PLAYERS.find({}, { 'player.smithing.totalxp': 1, 'player.smithing.level':1, pseudo: 1 }).sort({ 'player.smithing.totalxp': -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/leaderboard/agility', async (req, res) => {
  try {
    const leaderboard = await PLAYERS.find({}, { 'player.agility.totalxp': 1, 'player.agility.level':1, pseudo: 1 }).sort({ 'player.agility.totalxp': -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/leaderboard/cooking', async (req, res) => {
  try {
    const leaderboard = await PLAYERS.find({}, { 'player.cooking.totalxp': 1, 'player.cooking.level':1, pseudo: 1 }).sort({ 'player.cooking.totalxp': -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/leaderboard/magic', async (req, res) => {
  try {
    const leaderboard = await PLAYERS.find({}, { 'player.magic.totalxp': 1, 'player.magic.level':1, pseudo: 1 }).sort({ 'player.magic.totalxp': -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/leaderboard/taming', async (req, res) => {
  try {
    const leaderboard = await PLAYERS.find({}, { 'player.taming.totalxp': 1, 'player.taming.level':1, pseudo: 1 }).sort({ 'player.taming.totalxp': -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/leaderboard/crafting', async (req, res) => {
  try {
    const leaderboard = await PLAYERS.find({}, { 'player.crafting.totalxp': 1, 'player.crafting.level':1, pseudo: 1 }).sort({ 'player.crafting.totalxp': -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/leaderboard/kills', async (req, res) => {
  try {
    const leaderboard = await PLAYERS.find({}, { 'player.other.monsterKill': 1, pseudo: 1 }).sort({ 'player.other.monsterKill': -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/leaderboard/guilds', async (req, res) => {
  try {
    const leaderboard = await GUILDS.find({}, { squadXp: 1, squadName: 1 }).sort({ squadXp: -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get('/leaderboard/elo', async (req, res) => {
  try {
    const leaderboard = await PLAYERS.find({}, { 'player.elo': 1, pseudo: 1 }).sort({ 'player.elo': -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get('/leaderboard/petelo', async (req, res) => {
  try {
    const leaderboard = await PLAYERS.find({}, { 'player.petelo': 1, pseudo: 1 }).sort({ 'player.petelo': -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get('/leaderboard/slayer', async (req, res) => {
  try {
    const leaderboard = await PLAYERS.find({}, { 'player.slayer.totalxp': 1, 'player.slayer.level':1, pseudo: 1 }).sort({ 'player.slayer.totalxp': -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get('/leaderboard/farming', async (req, res) => {
  try {
    const leaderboard = await PLAYERS.find({}, { 'player.farming.totalxp': 1, 'player.farming.level':1, pseudo: 1 }).sort({ 'player.farming.totalxp': -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get('/leaderboard/tower', async (req, res) => {
  try {
    const leaderboard = await PLAYERS.find({}, { 'player.other.towerFloor': 1, pseudo: 1 }).sort({ 'player.other.towerFloor': -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get('/', async (req, res) => {
  try {
    const guilds = await GUILDS.find({});
    const players = await PLAYERS.find({});
    const balances = await BALANCES.find({});
    const parties = await PARTIES.find({});
    const stats = await STATS.find({});

    res.json({
      guilds,
      players,
      balances,
      parties,
      stats
    });
  } catch (error) {
    res.status(500).send(error);
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
