const Discord = require('discord.js');
const SQUADDATA = require('../../modules/squad.js')
const PLAYERDATA = require('../../modules/player.js');
const EMOJICONFIG = require('../../config/emoji.json');
const BALANCEDATA = require('../../modules/economie.js');
const { numStr } = require('../../functionNumber/functionNbr.js')
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const {client} = require('../../App/index.js');


// Config Cooldown :
const shuffleTime = 5000;
var cooldownPlayers = new Discord.Collection();

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

            const voteEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('FlipMMO Leaderboards')
            .setURL('https://stats.flipmmo.com')
            .setDescription('Click the link above to view leaderboards!')
            .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
            .setTimestamp()
            .setFooter({ text: 'FlipMMO Leaderboards'});

        message.channel.send({ embeds: [voteEmbed] });
        }
    },
info: {
    names: ['leadboard', 'lb', 'leaderboard'],
} }
