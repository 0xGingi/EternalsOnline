const Discord = require('discord.js');
const { prefix } = require('../../App/config.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');
// Import the necessary functions from other command files
const joinparty = require('./joinparty.js');
const leaveparty = require('./leaveparty.js');
const partyban = require('./partyban.js');
const myparty = require('./myparty.js');
const createparty = require('./createparty.js');
const listParty = require('./allparty.js');
const partydelete = require('./partydelete.js');
const partyview = require('./viewparty.js');
const partykick = require('./partykick.js');
const partyunban = require('./partyunban.js');
const partybanned = require('./partybanned.js');
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

        if (commandName === 'party') {
            const subCommand = args.shift()?.toLowerCase();
            
            switch (subCommand) {
                case undefined: 
                    await myparty.execute(message, args, 'myparty');
                    break;
                case 'join':
                    await joinparty.execute(message, args, 'joinparty');
                    break;
                case 'leave':
                    await leaveparty.execute(message, args, 'leaveparty');
                    break;
                case 'ban':
                    await partyban.execute(message, args, 'partyban');
                    break;
                case 'create':
                    await createparty.execute(message, args, 'createparty');
                    break;    
                case 'list':
                    await listParty.execute(message, args, 'allparty');
                    break;
                case 'destroy':
                    await partydelete.execute(message, args, 'partydelete');
                    break;
                case 'view':
                    await partyview.execute(message, args, 'partyview');
                    break;
                case 'kick':
                    await partykick.execute(message, args, 'partykick');
                    break;
                case 'unban':
                    await partyunban.execute(message, args, 'partyunban');
                    break;
                case 'banned':
                    await partybanned.execute(message, args, 'partybanned');
                    break;
    
    
                default:

                const embed = new EmbedBuilder()
                .setTitle('Party Commands')
                .addFields(
                    { name: '@FlipMMO party create <name>', value: 'create a party' },
                    { name: '@FlipMMO party join <name>', value: 'join a party' },
                    { name: '@FlipMMO party leave', value: 'leave your party' },
                    { name: '@FlipMMO party list', value: 'list all parties' },
                    { name: '@FlipMMO party kick <@Player>', value: 'kick a player from your party' },
                    { name: '@FlipMMO party ban <@Player>', value: 'perma ban a player from your party' },
                    { name: '@FlipMMO party unban <@Player>', value: 'unban a player from your party' },
                    { name: '@FlipMMO party banned', value: 'list all banned players from your party' },
                    { name: '@FlipMMO party destroy <name>', value: 'destroy your party' },
                    { name: '@FlipMMO party view <name>', value: 'view a party' }
                );
                message.reply({ embeds: [embed] });
                    break;
            }
        } }
    },
    info: {
        names: ['party'],
    }
};