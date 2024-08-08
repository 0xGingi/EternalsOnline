const Discord = require('discord.js');
const monsters = require('../../config/monster.json');
const PLAYERDATA = require('../../modules/player.js');
const STATS = require('../../modules/statsBot.js');
const SQUADDATA = require('../../modules/squad.js')
const EMOJICONFIG = require('../../config/emoji.json');
const BALANCEDATA = require('../../modules/economie.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const {client} = require('../../App/index.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { numStr } = require('../../functionNumber/functionNbr.js');
const crypto = require("crypto");
const { prefix } = require('../../App/config.json')
const configLevel = require('../../config/configLevel.json');
const CONFIGITEM = require('../../config/stuff.json')
const Party = require('../../modules/party.js');
const player = require('../../modules/player.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.mentions.users.first() !== client.user) return;
        const args = message.content.split(/ +/).slice(1);
        const commandName = args.shift().toLowerCase();
        if (this.info.names.some(name => commandName === name)) {

        var user = message.author
        const input = args[0];
        let playerStats = await PLAYERDATA.findOne({ userId: user.id });
        let balance = await BALANCEDATA.findOne({ userId: user.id });

        if (!playerStats) return message.reply(`${inlineCode('❌')} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
        if (playerStats.player.other.area !== 'wilderness') return message.reply(`${inlineCode('❌')} you are not in the wilderness! : ${inlineCode('@FlipMMO travel')}`);
        else {
            async function findEligiblePlayers(playerId) {
                return await PLAYERDATA.aggregate([
                    { $match: { userId: { $ne: playerId }, 'player.other.area': 'wilderness' } },
                    { $sample: { size: 10 } }
                ]);
            }
            let eligiblePlayers = await findEligiblePlayers(playerStats.player.level, message.author.id);
            if (eligiblePlayers.length === 0) {
                return message.reply(`Huh... There doesn't seem to be anyone around`);
            }
            let playerList = eligiblePlayers.map(p => `${p.pseudo} - Level ${p.player.level} - Ironman: ${p.player.other.ironman ? 'yes' : 'no'}`).join('\n');
            return message.reply(`You find some players in the wilderness:\n${playerList}`);
    
        }
    
        }
    },
    info: {
        names: ['scout'],
      } }