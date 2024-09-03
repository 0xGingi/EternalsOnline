const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const EMOJICONFIG = require('../../config/emoji.json');
const BALANCEDATA = require('../../modules/economie.js');
const { numStr } = require('../../functionNumber/functionNbr.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType, Collection } = require('discord.js');
const { prefix } = require('../../App/config.json')
const STATS = require('../../modules/statsBot.js');
const {client} = require('../../App/index.js');



// Config Cooldown :
const shuffleTime = 3600000;
var cooldownPlayers = new Discord.Collection();
module.exports = {
    name: Events.MessageCreate,

async execute(message) {
    if (message.mentions.users.first() !== client.user) return;
    const args = message.content.split(/ +/).slice(1);
    const commandName = args.shift().toLowerCase();
    if (this.info.names.some(name => commandName === name)) {

    var user = message.author;
    let stats = await STATS.findOne({ botID: 899 });
    let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
    if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
    if (playerStats.player.other.ironman === true) return message.reply(`${EMOJICONFIG.no} You are an ironman, you can't beg!`);
    else {
        if (playerStats.player.cooldowns && playerStats.player.cooldowns.beg) {
            const timeSinceLastDaily = new Date().getTime() - new Date(playerStats.player.cooldowns.beg).getTime();
            if (timeSinceLastDaily < shuffleTime) {
                var measuredTime = new Date(null);
                measuredTime.setSeconds(Math.ceil((shuffleTime - timeSinceLastDaily) / 1000));
                var MHSTime = measuredTime.toISOString().substr(11, 8);
                message.channel.send(`${EMOJICONFIG.hellspawn} Please wait \`${MHSTime}\` and try again.`);
                return;
            }
        }

        let balance = await BALANCEDATA.findOne({ userId: message.author.id });
        if (!balance) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
        else {
            if (playerStats.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@Eternals energy')}`)

            var randomCoin = Math.floor(Math.random() * (playerStats.player.level * (5 * playerStats.player.level)));
            var randomXp = Math.abs(Math.floor(Math.random() * (playerStats.player.level * (5 * playerStats.player.level))));

            balance.eco.coins += randomCoin;
            stats.amoutCoin += randomCoin;
            balance.eco.xp += randomXp;
            await balance.save();
            await stats.save();
            
            playerStats.player.cooldowns = playerStats.player.cooldowns || {};
            playerStats.player.cooldowns.beg = new Date().toISOString();
            playerStats.player.energy -= 2;
            await playerStats.save();

            message.reply(`${EMOJICONFIG.coinchest} Someone feels pity for you and gives you: ${inlineCode(numStr(randomCoin))} ${EMOJICONFIG.coin} and ${inlineCode(numStr(randomXp))} ${EMOJICONFIG.xp}. This might be a better job than killing monsters... but probably not.`);


        };
    };
};
},
info: {
    names: ['beg'],
} }
