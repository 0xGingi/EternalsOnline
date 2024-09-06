const config = require('./config.json');
const { Client, GatewayIntentBits, Collection, Events, ActivityType, Status } = require('discord.js');
const { dim, yellow } = require('colors');
require('events').EventEmitter.prototype._maxListeners = 200;
const mongoose = require('mongoose');

mongoose
.connect(config.mongodb, {})
.then(() => console.log(`MongoDB Ready`))
.catch(err => console.error(`MongoDB connection error: ${err}`));

const client = new Client({ intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences] });
module.exports = { client, mongoose };

client.commands = new Collection();
client.events = new Collection();

const { loadEvents } = require('./Handlers/Events');
const { loadCommands } = require('./Handlers/Commands');

client.on('disconnect', () => {
    console.log('Bot is disconnected!');
});

client.on('reconnecting', () => {
    console.log('Bot is reconnecting...');
});

client.once('ready', async () => {
    await loadCommands(client);
    await loadEvents(client);
    console.log(`\n${dim('User:')} ${yellow(client.user.tag)}\n`)
    console.log(`${dim('-----------------------------------------------------------')}`)
    console.log(`\n${dim('Developed by:')} ${yellow('0xGingi | https://github.com/0xGingi ')}`)
    await client.user.setPresence({
        activities: [{name :'@Eternals help', type: ActivityType.Playing }],
        status: `online`,
    });

    client.on('disconnect', () => {
        console.log('Bot is disconnected! Trying to reconnect!');
        setTimeout(() => client.login(config.token), 5000);
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
