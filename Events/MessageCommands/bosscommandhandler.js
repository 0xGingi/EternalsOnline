const Discord = require('discord.js');
const { prefix } = require('../../App/config.json');
const { Message, Events } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');
// Import the necessary functions from other command files
const allboss = require('./allboss.js');
const bossattack = require('./bossattack.js');
const boss = require('./boss.js');
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

        if (commandName === 'boss') {
            const subCommand = args.shift()?.toLowerCase();
            
            switch (subCommand) {
                case undefined: 
                    await boss.execute(message, args, 'currentboss');
                    break;
                case 'attack':
                    await bossattack.execute(message, args, 'bossattack');
                    break;
                case 'all':
                    await allboss.execute(message, args, 'allboss');
                    break;
                default:
                    // Handle unknown subcommands
                    message.reply("Unknown subcommand for boss. Please use '@Eternals boss' '@Eternals boss all' or '@Eternals boss attack'");
                    break;
            }
        } }
    },
    info: {
        names: ['boss'],
    }
};