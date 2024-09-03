const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const SQUADDATA = require('../../modules/squad.js')
const {client} = require('../../App/index.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');
const fs = require('fs');
const path = require('path');
const commandsDir = path.join(__dirname, '../MessageCommands');
const numCommands = fs.readdirSync(commandsDir).length;

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
  let uptimeForEmbed = `${Math.round(client.uptime / (1000 * 60 * 60))}h, ${Math.round(client.uptime / (1000 * 60)) % 60}m, ${Math.round(client.uptime / 1000) % 60}s`;
  let apiForEmbed = client.ws.ping !== -1 ? `${Math.round(client.ws.ping)} ms` : '15';
  let numUsers = await PLAYERDATA.countDocuments({});
  let numGuilds = await SQUADDATA.countDocuments({});
  //await client.guilds.cache.fetch();
  let serverCount = client.guilds.cache.size;

    let infoBotEmbed = new EmbedBuilder()
      .setColor('E03636')
      .setAuthor({name: 'Bot Info', iconURL: 'https://cdn.discordapp.com/app-icons/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png'})
      .addFields(
        { name: 'Owner :', value: '0xGingi + StillDegen', inline: true },
        { name: 'Prefix :', value: 'Mention @Eternals ', inline: true },
        { name: 'Uptime :', value: uptimeForEmbed, inline: true },
        { name: 'Programming language  :', value: 'JavaScript', inline: true },
        { name: 'API  :', value: apiForEmbed, inline: true },
        { name: 'Number Commands  :', value: numCommands.toString(), inline: true },
        { name: 'Version  :', value: 'Eternals 2.0a', inline: true },
        { name: 'Users  :', value: `${numUsers}`, inline: true },
        { name: 'Servers :', value: `${serverCount}`, inline: true },
        { name: '**Eternals Server**', value:`[Official Server](https://discord.gg/ywdfj3qbrF)`,inline: true},
        { name: '**Eternals Invite**', value: `[Invite to your Server](https://discord.com/api/oauth2/authorize?client_id=1234552588339511439&permissions=139586792512&scope=applications.commands+bot)`, inline: true},

      )

    message.channel.send({embeds: [infoBotEmbed]});
  }
},
info: {
  names: ['info'],
}
}