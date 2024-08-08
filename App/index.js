const config = require('App/config.json');
const { Client, GatewayIntentBits, Collection, Events, ActivityType, Status } = require('discord.js');
const { dim, yellow } = require('colors');
require('events').EventEmitter.prototype._maxListeners = 200;
const mongoose = require('mongoose');

mongoose
   .connect(config.mongodb, {})
   .then(() => console.log(`${dim('\nMongoDB:')} ${yellow('Ready')}`));

const client = new Client({ intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences] });
module.exports = { client, mongoose };

client.commands = new Collection();
client.events = new Collection();
console.log(client.events)
const { loadEvents } = require('./Handlers/Events');
const { loadCommands } = require('./Handlers/Commands');


client.once('ready', async () => {
    console.log('Bot is ready');
    await loadCommands(client);
    await loadEvents(client);
    await client.user.setPresence({
        activities: [{name :'@FlipMMO help', type: ActivityType.Playing }],
        status: `online`,
    });
});
client.login(config.token);

// Anticrash | Return an error and it won't stop the bot.
process.on('unhandledRejection', (err, origin) => {
    console.log('Error.\n', err.stack);
});

process.on('uncaughtException', (err, origin) => {
    console.log('Error.\n', err.stack);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('Error.\n', err.stack);
});