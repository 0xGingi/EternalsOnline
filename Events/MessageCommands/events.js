const Discord = require('discord.js');
const { prefix } = require('../../App/config.json');
const { Message, Events } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');
// Import the necessary functions from other command files
const thanksgiving = require('./thanksgivingevent.js');
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
            var user = message.author
        if(user.id == '351859727568994314' || user.id == '919048526518960198' || user.id == '217025723573993474') { 

        if (commandName === 'events') {
            const subCommand = args.shift()?.toLowerCase();
            
            switch (subCommand) {
                case 'thanksgiving':
                    await thanksgiving.execute(message, args, 'thanksgiving');
                    break;

                default:
                    // Handle unknown subcommands
                    message.reply("Unknown subcommand");
                    break;
            }
        }
    
     }          
     else {
        return message.reply("Sorry! This command is only for admins only...");
    }
        }
    },
    info: {
        names: ['events'],
    }
};