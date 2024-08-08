const Discord = require('discord.js');
const { prefix } = require('../../App/config.json');
const { Message, Events } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');
// Import the necessary functions from other command files
const fish = require('./idlefish.js');
const mine = require('./idlemine.js');
const chop = require('./idlechop.js');
const fight = require('./idlefight');
const agility = require('./idleagility.js');
const {client} = require('../../App/index.js');

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */
    async execute(message) {
        if (message.mentions.users.first() !== client.user) return;
        const args = message.content.split(/ +/).slice(1);
        const commandName = args.shift().toLowerCase();
        if (this.info.names.some(name => commandName === name)) {

        if (commandName === 'idle') {
            const subCommand = args.shift()?.toLowerCase();
            
            switch (subCommand) {
                case 'fish':
                    await fish.execute(message, args, 'idlefish');
                    break;
                case 'mine':
                    await mine.execute(message, args, 'idlemine');
                    break;
                case 'chop':
                    await chop.execute(message, args, 'idlechop');
                    break;
                case 'fight':
                    await fight.execute(message, args, 'idlefight');
                    break;
                case 'lap':
                    await agility.execute(message, args, 'idlelap');
                    break;

                default:
                    // Handle unknown subcommands
                    message.reply("Unknown subcommand for idle. Please use 'fight','fish', 'mine', 'chop', or 'lap'");
                    break;
            }
        } }
    },
    info: {
        names: ['idle'],
    }
};