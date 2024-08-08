const { prefix } = require('../../App/config.json');
const { Message, Events } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');
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

                

        const roll = Math.floor(Math.random() * 99) + 1;
        await message.reply(`${message.author.username} has rolled ${roll}`);

        }
    },

    info: {
        names: ['roll'],
    }
};
