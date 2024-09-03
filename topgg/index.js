const express = require('express');
const { Webhook } = require('@top-gg/sdk');
const PLAYER = require('./modules/player.js');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();

const webhook = new Webhook('');
mongoose.connect('');

app.use('/vote', function(req, res, next) {
  if (req.method === 'POST') {
      console.log(`Received a POST request to /vote at ${new Date().toISOString()}`);
      console.log(`Body: ${JSON.stringify(req.body)}`);
  }
  next();
});

app.post('/vote', webhook.listener(async vote => {
  try {
    const userId = vote.user;
    const player = await PLAYER.findOne({ userId: userId });
    if (!player){
      console.log(`Player ${userId} not found`);
      return;
    }
    if (player) {
      if(player.player.other.topggLastVoted && new Date(player.player.other.topggLastVoted).getTime() > new Date().getTime() - 86400000){
        player.player.other.topggVotes += 1;
        player.player.other.topggStreak += 1;
        player.player.other.topggLastVoted = new Date().toISOString();
        if(player.player.other.topggStreak === 1) {
          player.player.other.topggbox += 1;
          const packs = ['orepack', 'fishpack', 'logpack'];
          const selectedPack = packs[Math.floor(Math.random() * packs.length)];
          player.player.other[selectedPack] += 1;
          await player.save();
          console.log(`Added 1 box and 1 ${selectedPack} to player ${userId}`);
        }
        if(player.player.other.topggStreak === 2 || player.player.other.topggStreak === 3) {
          player.player.other.topggbox += 1;
          const packs = ['orepack', 'fishpack', 'logpack'];
          const selectedPack1 = packs[Math.floor(Math.random() * packs.length)];
          const selectedPack2 = packs[Math.floor(Math.random() * packs.length)];
          player.player.other[selectedPack1] += 1;
          player.player.other[selectedPack2] += 1;
          await player.save();
          console.log(`Added rewards to player ${userId}`);
        }
        if(player.player.other.topggStreak === 4 || player.player.other.topggStreak === 5) {
          player.player.other.topggbox += 1;
          const packs = ['orepack', 'fishpack', 'logpack'];
          const selectedPack1 = packs[Math.floor(Math.random() * packs.length)];
          const selectedPack2 = packs[Math.floor(Math.random() * packs.length)];
          const selectedPack3 = packs[Math.floor(Math.random() * packs.length)];
          player.player.other[selectedPack1] += 1;
          player.player.other[selectedPack2] += 1;
          player.player.other[selectedPack3] += 1;
          await player.save();
          console.log(`Added rewards to player ${userId}`);
        }
        if(player.player.other.topggStreak === 6) {
          player.player.other.topggbox += 1;
          const packs = ['orepack', 'fishpack', 'logpack'];
          const selectedPack1 = packs[Math.floor(Math.random() * packs.length)];
          const selectedPack2 = packs[Math.floor(Math.random() * packs.length)];
          const selectedPack3 = packs[Math.floor(Math.random() * packs.length)];
          const selectedPack4 = packs[Math.floor(Math.random() * packs.length)];
          player.player.other[selectedPack1] += 1;
          player.player.other[selectedPack4] += 1;
          player.player.other[selectedPack2] += 1;
          player.player.other[selectedPack3] += 1;
          await player.save();
          console.log(`Added rewards to player ${userId}`);
        }
        if(player.player.other.topggStreak === 7) {
          player.player.other.topggbox += 1;
          const packs = ['orepack', 'fishpack', 'logpack'];
          const selectedPack1 = packs[Math.floor(Math.random() * packs.length)];
          const selectedPack2 = packs[Math.floor(Math.random() * packs.length)];
          const selectedPack3 = packs[Math.floor(Math.random() * packs.length)];
          const selectedPack4 = packs[Math.floor(Math.random() * packs.length)];
          const selectedPack5 = packs[Math.floor(Math.random() * packs.length)];
          player.player.other[selectedPack1] += 1;
          player.player.other[selectedPack4] += 1;
          player.player.other[selectedPack2] += 1;
          player.player.other[selectedPack3] += 1;
          player.player.other[selectedPack5] += 1;
          player.player.other.petbox += 1;
          player.player.other.topggStreak = 0;
          await player.save();
          console.log(`Added rewards to player ${userId}`);
        }
      }
      else if(player.player.other.topggLastVoted && new Date(player.player.other.topggLastVoted).getTime() < new Date().getTime() - 86400000){
      player.player.other.topggVotes += 1;
      player.player.other.topggStreak = 1;
      player.player.other.topggLastVoted = new Date().toISOString();
      player.player.other.topggbox += 1;
      const packs = ['orepack', 'fishpack', 'logpack'];
      const selectedPack = packs[Math.floor(Math.random() * packs.length)];
      player.player.other[selectedPack] += 1;
      player.player.other.topggVotes += 1;
      player.player.other.topggStreak += 1;
      player.player.other.topggLastVoted = new Date().toISOString();
      await player.save();
      console.log(`Added 1 box and 1 ${selectedPack} to player ${userId}`);
      }
      else {
      player.player.other.topggVotes += 1;
      player.player.other.topggStreak += 1;
      player.player.other.topggLastVoted = new Date().toISOString();
      player.player.other.topggbox += 1;
      const packs = ['orepack', 'fishpack', 'logpack'];
      const selectedPack = packs[Math.floor(Math.random() * packs.length)];
      player.player.other[selectedPack] += 1;
      player.player.other.topggVotes += 1;
      player.player.other.topggStreak += 1;
      player.player.other.topggLastVoted = new Date().toISOString();
      await player.save();
      console.log(`Added 1 box and 1 ${selectedPack} to player ${userId}`);
      }
    }
  } catch (error) {
    console.error('Failed to add box and pack to player:', error);
}
}));

app.listen(5050, () => {
  console.log('Webhook running on port 5050');
});
