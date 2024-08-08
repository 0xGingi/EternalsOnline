const Discord = require('discord.js');
const { prefix } = require('../../App/config.json');
const { Message, Events } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');
// Import the necessary functions from other command files
const common = require('./openBox.js');
const rare = require('./openrare.js');
const topgg = require('./opentopgg.js');
const orepack = require('./orepack.js');
const fishpack = require('./fishpack.js');
const logpack = require('./logpack.js');
const petbox = require('./petbox.js');
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

        if (commandName === 'open') {
            const subCommand = args.shift()?.toLowerCase();
            
            switch (subCommand) {
                case 'common': 
                    await common.execute(message, args, 'openbox');
                    break;
                case 'rare':
                    await rare.execute(message, args, 'openrare');
                    break;
                case 'topgg':
                    await topgg.execute(message, args, 'opentopgg');
                    break;
                case 'orepack':
                    await orepack.execute(message, args, 'openorepack');
                    break;
                case 'fishpack':
                    await fishpack.execute(message, args, 'openfishpack');
                    break;
                case 'logpack':
                    await logpack.execute(message, args, 'openlogpack');
                    break;
                case 'pet':
                    await petbox.execute(message, args, 'openpetbox');
                    break;
                default:
                    // Handle unknown subcommands
                    message.reply("Unknown box. Box types are common, rare, topgg, orepack, fishpack, logpack, and pet");
                    break;
            }
        } }
    },
    info: {
        names: ['open'],
    }
};