const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { prefix } = require('../../App/config.json')
const EMOJICONFIG = require('../../config/emoji.json');
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

  var user = message.author;

  /**=== Account Stats ===*/
  let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
  if (!playerStats) return message.reply(`${inlineCode('❌')} you are not a player ! : ${inlineCode('@Eternals start')}`);
  else {
    if(playerStats.player.other.dm == false){
        playerStats.player.other.dm = true
        playerStats.save()
        return message.reply(`${inlineCode('✅')} Battle diary activate in your DM`)
    } else {
        playerStats.player.other.dm = false
        playerStats.save()
        return message.reply(`${inlineCode('❌')} Battle diary not activate in your DM`)
    }
  }
};
  },
info: {
    names: ['dm'],
} }
