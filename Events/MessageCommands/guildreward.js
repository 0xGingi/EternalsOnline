const Discord = require('discord.js');
const SQUADDATA = require('../../modules/squad.js')
const PLAYERDATA = require('../../modules/player.js');
const STATS = require('../../modules/statsBot.js');
const EMOJICONFIG = require('../../config/emoji.json');
const BALANCEDATA = require('../../modules/economie.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { numStr } = require('../../functionNumber/functionNbr.js');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { client } = require('../../App/index.js');
// Config Cooldown :
const shuffleTime = 8.64e7;
var cooldownPlayers = new Discord.Collection();

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

async execute(message, args, commandName) {
  //  const args = message.content.slice(prefix.length).trim().split(/ +/);
  //  const commandName = args.shift().toLowerCase();
  if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {


  var user = message.author;
  var squadNameAttack = args[0]
    // == Player Db ==
    let playerStats = await PLAYERDATA.findOne({ userId: user.id });
    if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
    else {

        if (playerStats.player.cooldowns && playerStats.player.cooldowns.guildReward) {
            const timeSinceLastDaily = new Date().getTime() - new Date(playerStats.player.cooldowns.guildReward).getTime();
            if (timeSinceLastDaily < shuffleTime) {
                var measuredTime = new Date(null);
                measuredTime.setSeconds(Math.ceil((shuffleTime - timeSinceLastDaily) / 1000));
                var MHSTime = measuredTime.toISOString().substr(11, 8);
                message.channel.send(`${EMOJICONFIG.hellspawn} Please wait \`${MHSTime}\` and try again.`);
                return;
            }
        }


        // == Balance Data ==
        let balance = await BALANCEDATA.findOne({ userId: user.id });
        if (!balance) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
        else {

            // == Squad Data ==
            let squad = await SQUADDATA.findOne({ squadName: playerStats.player.other.squadName });
            if (!squad) return message.reply(`${EMOJICONFIG.no} you haven't joined a Guild yet : ${inlineCode('@Eternals guild join <guild name>')}`);
            else {


                var rewardPlayer = Math.floor( ((squad.squadXp / 1000) * playerStats.player.level) * 1 );
                message.reply(`${EMOJICONFIG.coinchest} Your reward of the day is ${inlineCode(numStr(rewardPlayer))} ${EMOJICONFIG.coin} thanks to your guild: ${inlineCode(squad.squadName)}`);

                balance.eco.coins += rewardPlayer;
                await balance.save();

                let stats = await STATS.findOne({ botID: 899 });
                stats.amoutCoin += rewardPlayer;
                await stats.save();
                
                squad.squadXp += 50;
                await squad.save();

                playerStats.player.cooldowns = playerStats.player.cooldowns || {};
                playerStats.player.cooldowns.guildReward = new Date().toISOString();
                await playerStats.save();   
            };
        };
    };
};
},
info: {
    names: ['guildreward'],
} }
